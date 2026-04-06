"use client";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
import API_URL from "../api";
import { ArrowLeft, Wand2, Eye, Download, Sparkles, RefreshCw } from "lucide-react";

export default function Modify() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [projectId, setProjectId] = useState(null);
  const [currentCode, setCurrentCode] = useState("");
  const [modification, setModification] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    const onMove = (e) => {
      const x = e.clientX ?? e.touches?.[0]?.clientX;
      const y = e.clientY ?? e.touches?.[0]?.clientY;
      if (x == null) return;
      mouseX = x;
      mouseY = y;
      if (dotRef.current) dotRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(animate);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    const raf = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email);
    }
    const savedCode = localStorage.getItem("generatedCode");
    const savedPages = localStorage.getItem("generatedPages");
    const savedProjectId = localStorage.getItem("currentProjectId");
    if (savedPages) {
      const parsed = JSON.parse(savedPages);
      setCurrentCode(parsed['index.html'] || parsed[Object.keys(parsed)[0]] || savedCode || "");
    } else if (savedCode) {
      setCurrentCode(savedCode);
    }
    if (savedProjectId) setProjectId(savedProjectId);
  }, []);

  const handleModify = async () => {
    if (!modification.trim() || !projectId) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/modify`, {
        projectId: parseInt(projectId),
        modification,
        email
      });
      setOutput(res.data.output);
      if (typeof res.data.output === 'object') {
        localStorage.setItem("generatedPages", JSON.stringify(res.data.output));
        localStorage.setItem("generatedCode", res.data.output['index.html'] || "");
      } else {
        localStorage.setItem("generatedCode", res.data.output);
      }
      setCurrentCode(res.data.output['index.html'] || res.data.output);
    } catch (err) {
      alert(err.response?.data?.error || "Modification failed");
    } finally {
      setLoading(false);
    }
  };

  const quickModifications = [
    "Change colors to blue theme",
    "Update headline text",
    "Add contact form",
    "Make it mobile responsive"
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      <div className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2" style={{ willChange: "transform" }}>
        <div className="w-2 h-2 rounded-full bg-violet-400" />
      </div>
      <div className="pointer-events-none fixed top-0 left-0 z-[9998] -translate-x-1/2 -translate-y-1/2" style={{ willChange: "transform" }}>
        <div className="w-8 h-8 rounded-full border border-violet-500/50" style={{ mixBlendMode: "difference" }} />
      </div>

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
      
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-violet-700/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-56 h-56 bg-fuchsia-700/15 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        <button onClick={() => navigate("/projects")} className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Modify Website</span>
          </h1>
          <p className="text-zinc-400">Make changes to your existing website - uses less credits!</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              What should we change?
            </h2>
            <p className="text-zinc-400 text-sm mb-6">Describe the modifications you'd like to make</p>
            
            <textarea
              value={modification}
              onChange={(e) => setModification(e.target.value)}
              placeholder="e.g., Change the hero headline, update the color scheme to blue, add a contact form section"
              className="w-full h-44 p-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-zinc-500 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 outline-none transition resize-none mb-4"
            />

            <div className="mb-6">
              <p className="text-xs text-zinc-500 mb-3">Quick modifications:</p>
              <div className="flex flex-wrap gap-2">
                {quickModifications.map((mod) => (
                  <button
                    key={mod}
                    onClick={() => setModification(mod)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-zinc-300 hover:text-white transition"
                  >
                    {mod}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleModify}
              disabled={loading || !modification.trim()}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Modifying...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Apply Changes
                </>
              )}
            </button>

            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-xs text-green-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Modifications use 50% less credits than creating a new website
              </p>
            </div>
          </div>

          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-600 to-violet-600 flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              Live Preview
            </h2>
            <p className="text-zinc-400 text-sm mb-6">See your changes in real-time</p>
            
            {currentCode && (
              <div className="bg-white rounded-xl overflow-hidden border border-white/10">
                {currentCode.includes("import React") ? (
                  <div className="w-full h-[500px] bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-8 text-center">
                    <h3 className="text-xl font-bold text-white mb-3">React Project</h3>
                    <p className="text-zinc-400 mb-4">This is a React project. Preview works best in the dedicated Preview page.</p>
                    <button onClick={() => navigate("/preview")} className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-sm font-medium transition">
                      View Full Preview
                    </button>
                  </div>
                ) : (
                  <iframe 
                    title="Website Preview"
                    srcDoc={`<!DOCTYPE html>
<html>
<head>
  <script src='https://cdn.tailwindcss.com'></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            display: ['Syne', 'sans-serif'],
            sans: ['Plus Jakarta Sans', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body style="background: #0a0a0f;">${currentCode}</body>
</html>`} 
                  className="w-full h-[500px] border-0" 
                />
                )}
              </div>
            )}
          </div>
        </div>

        {output && (
          <div className="mt-8 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                Updated Code
              </h2>
              <div className="flex gap-3">
                <button onClick={() => navigate("/preview")} className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-medium transition flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Preview
                </button>
                <button onClick={() => navigate("/deploy")} className="px-5 py-2.5 bg-green-600 hover:bg-green-500 rounded-xl text-sm font-medium transition flex items-center gap-2">
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </div>
            <div className="bg-black/40 rounded-2xl p-4 overflow-auto max-h-80">
              <pre className="text-sm text-zinc-300 font-mono whitespace-pre-wrap">{output}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
