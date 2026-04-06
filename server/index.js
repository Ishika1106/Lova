require("dotenv").config();
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const Groq = require("groq-sdk");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const razorpay = require("./razorpay");

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const GROQ_MODEL = "llama-3.3-70b-versatile";

const MODEL_PRICING = {
  "llama-3.3-70b-versatile": { input: 0.00, output: 0.00 },
};

// Load prompts from prompts.txt
const PROMPTS = {
  index: "",
  about: "",
  contact: "",
  reactIndex: "",
  reactAbout: "",
  reactContact: "",
  refine: "",
  modify: ""
};

try {
  const promptsContent = fs.readFileSync(path.join(__dirname, "prompts.txt"), "utf8");
  
  const indexMatch = promptsContent.match(/## INDEX_HTML_PROMPT([\s\S]*?)(?=##|$)/);
  const reactIndexMatch = promptsContent.match(/## REACT_INDEX_PROMPT([\s\S]*?)(?=##|$)/);
  const refineMatch = promptsContent.match(/## REFINEMENT_PROMPT([\s\S]*?)(?=##|$)/);
  const modifyMatch = promptsContent.match(/## MODIFICATION_PROMPT([\s\S]*?)$/);
  
  if (indexMatch) PROMPTS.index = indexMatch[1].trim();
  if (reactIndexMatch) PROMPTS.reactIndex = reactIndexMatch[1].trim();
  if (refineMatch) PROMPTS.refine = refineMatch[1].trim();
  if (modifyMatch) PROMPTS.modify = modifyMatch[1].trim();
  
  console.log("Prompts loaded:", Object.keys(PROMPTS).filter(k => PROMPTS[k]));
} catch (err) {
  console.error("Failed to load prompts.txt:", err.message);
}

app.get("/", (req, res) => {
  res.send("Lova AI Server running");
});

app.get("/api/models", async (req, res) => {
  try {
    const models = await groq.models.list();
    res.json(models.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch models" });
  }
});

app.post("/api/generate", async (req, res) => {
  const { prompt, email, websiteType } = req.body;
  console.log("Generate request:", { email, websiteType, prompt: prompt?.substring(0, 50) });

  try {
    if (!PROMPTS.refine || !PROMPTS.index) {
      throw new Error("Prompts not loaded properly");
    }
    
    // Check user credits
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(403).json({ error: "User not found. Please sign up." });
    }
    
    const userData = user.rows[0];
    if (userData.websites <= 0) {
      return res.status(403).json({ error: "No credits left. Please purchase more credits." });
    }

    console.log("User has credits:", userData.websites);
    
    let refinedPrompt = prompt;

    const refineRes = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: PROMPTS.refine },
        { role: "user", content: refinedPrompt }
      ],
      temperature: 0.3,
      max_tokens: 150,
    });
    const structuredPrompt = refineRes.choices[0].message.content;
    console.log("Refined prompt:", structuredPrompt?.substring(0, 100));

    // Generate based on websiteType (html or react)
    let indexHtml, aboutHtml, contactHtml, completions = [];
    
    const generatePage = async (prompt, userContent) => {
      const completion = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: userContent }
        ],
        temperature: 0.75,
        max_tokens: 6000,
      });
      completions.push(completion);
      return completion.choices[0].message.content;
    };

    if (websiteType === "react") {
      indexHtml = await generatePage(PROMPTS.reactIndex, `Generate complete App.jsx with ALL sections (Hero, Features, Stats, Testimonials, CTA, Footer, About, Contact) for: ${structuredPrompt}`);
      
      var aiOutput = JSON.stringify({
        "App.jsx": indexHtml
      });
    } else {
      indexHtml = await generatePage(PROMPTS.index, `Generate complete index.html with ALL sections (Hero, Features, Stats, Testimonials, CTA, Footer, About, Contact) for: ${structuredPrompt}`);
      
      var aiOutput = JSON.stringify({
        "index.html": indexHtml
      });
    }

    // Deduct 1 credit for website generation
    await pool.query(
      "UPDATE users SET websites = websites - 1 WHERE email = $1",
      [email]
    );

    // Save project to database
    const userId = user.rows[0].id;
    const projectName = prompt.substring(0, 50) + (prompt.length > 50 ? "..." : "");
    await pool.query(
      "INSERT INTO projects (user_id, name, prompt, website_type, generated_code, modification_count) VALUES ($1, $2, $3, $4, $5, 0)",
      [userId, projectName, prompt, websiteType, aiOutput]
    );

    const inputTokens = (refineRes.usage?.prompt_tokens || 0) + completions.reduce((sum, c) => sum + (c.usage?.prompt_tokens || 0), 0);
    const outputTokens = (refineRes.usage?.completion_tokens || 0) + completions.reduce((sum, c) => sum + (c.usage?.completion_tokens || 0), 0);
    const totalTokens = inputTokens + outputTokens;
    const cost = (inputTokens * (MODEL_PRICING[GROQ_MODEL]?.input || 0) + outputTokens * (MODEL_PRICING[GROQ_MODEL]?.output || 0)) / 1000;

    // Get updated user data
    const updatedUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    res.json({
      output: aiOutput,
      websitesLeft: updatedUser.rows[0]?.websites || 0,
      promptsRemaining: 6 - (updatedUser.rows[0]?.prompts_used || 0),
      websiteType,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens,
        cost: cost.toFixed(4)
      }
    });
  } catch (err) {
    console.error("Generate error:", err.message, err.stack);
    res.status(500).json({ error: "Generation failed", details: err.message });
  }
});

app.post("/api/modify", async (req, res) => {
  const { projectId, modification, email } = req.body;

  try {
    const project = await pool.query("SELECT * FROM projects WHERE id = $1", [projectId]);
    if (project.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const currentCode = project.rows[0].generated_code;
    const currentType = project.rows[0].website_type;
    const modificationCount = project.rows[0].modification_count || 0;

    // Check modification limit (max 5 modifications per project)
    if (modificationCount >= 5) {
      return res.status(403).json({ error: "Maximum 5 modifications allowed per project" });
    }

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: PROMPTS.modify },
        { role: "user", content: `Current code:\n${currentCode}\n\nModification request: ${modification}` }
      ],
      temperature: 0.7,
      max_tokens: 6000,
    });

    const modifiedCode = completion.choices[0].message.content;

    // Update project with new code and increment modification count
    await pool.query(
      "UPDATE projects SET generated_code = $1, modification_count = modification_count + 1 WHERE id = $2",
      [modifiedCode, projectId]
    );

    res.json({ 
      output: modifiedCode,
      modificationsLeft: 5 - modificationCount - 1
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Modification failed" });
  }
});

app.post("/api/voice-to-text", async (req, res) => {
  try {
    const { audio, language_code } = req.body;
    
    const response = await axios.post(
      "https://api.sarvam.ai/speech-to-text",
      {
        audio: audio,
        model: "saarika:v2",
        language_code: language_code || "en-IN"
      },
      { 
        headers: { 
          Authorization: `Bearer ${process.env.SARVAM_API_KEY}`,
          "Content-Type": "application/json"
        } 
      }
    );
    
    const text = response.data?.alternatives?.[0]?.transcript || response.data?.text || "";
    res.json({ transcription: text });
  } catch (err) {
    console.error("Sarvam error:", err.response?.data || err.message);
    res.status(500).json({ error: "Voice transcription failed", details: err.message });
  }
});

// User routes
app.post("/api/create-user", async (req, res) => {
  try {
    const { email, name } = req.body;
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.json({ message: "User already exists", websites: existing.rows[0].websites });
    }
    // New user gets 1 FREE credit
    await pool.query(
      "INSERT INTO users (email, name, websites, prompts_used) VALUES ($1, $2, 1, 0)",
      [email, name]
    );
    res.json({ message: "User created", websites: 1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.get("/api/user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.json({ websites: 0, prompts_used: 0 });
    }
    res.json(user.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to get user" });
  }
});

app.get("/api/projects/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) return res.json([]);
    const projects = await pool.query(
      "SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC",
      [user.rows[0].id]
    );
    res.json(projects.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to get projects" });
  }
});

app.delete("/api/project/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM projects WHERE id = $1", [id]);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete project" });
  }
});

app.post("/api/add-free-credits", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) return res.status(404).json({ error: "User not found" });
    // Add 1 credit
    await pool.query("UPDATE users SET websites = websites + 1 WHERE email = $1", [email]);
    const updatedUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    res.json({ message: "Credit added", websites: updatedUser.rows[0].websites });
  } catch (err) {
    res.status(500).json({ error: "Failed to add credits" });
  }
});

// Payment routes
app.post("/api/create-order", async (req, res) => {
  try {
    const { amount, email } = req.body;
    console.log("Creating order for amount:", amount, "email:", email);
    
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    
    console.log("Order created:", order.id);
    res.json(order);
  } catch (err) {
    console.error("Razorpay error:", err);
    res.status(500).json({ error: "Failed to create order", details: err.message });
  }
});

app.post("/api/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, plan } = req.body;
    console.log("Verification request:", { razorpay_order_id, razorpay_payment_id, email, plan });
    
    // Determine credits based on plan
    let creditsToAdd = 1;
    console.log("Plan received:", plan);
    if (plan === "3") {
      creditsToAdd = 3;
    } else if (plan === "10") {
      creditsToAdd = 10;
    }
    console.log("Credits to add:", creditsToAdd, "for email:", email);
    
    // Add credits after successful payment
    const result = await pool.query(
      "UPDATE users SET websites = websites + $1 WHERE email = $2 RETURNING websites",
      [creditsToAdd, email]
    );
    console.log("Updated user websites:", result.rows[0]?.websites);
    
    res.json({ success: true, message: `Payment verified, ${creditsToAdd} credits added` });
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

// Vercel/Serverless entry point (for Vercel only)
if (process.env.VERCEL === "true") {
  module.exports = app;
} else {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
