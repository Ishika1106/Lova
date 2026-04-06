"use client";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
import API_URL from "../api";
import { Mic, Lightbulb, Code, History, Zap, Sparkles, ChevronRight, Volume2, ArrowLeft } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [credits, setCredits] = useState({ websites: 0, promptsRemaining: 6 });
  const [mode, setMode] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [voiceText, setVoiceText] = useState("");
  const [websiteType, setWebsiteType] = useState("html");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
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

  const fetchCredits = async (userEmail) => {
    try {
      const res = await axios.get(`${API_URL}/api/user/${userEmail}`);
      setCredits(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCheckingAuth(false);
      if (user) {
        setEmail(user.email);
        fetchCredits(user.email);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  if (checkingAuth) {
    return null;
  }

  const handleGenerate = async () => {
    if (!prompt.trim() && !voiceText.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/generate`, {
        prompt: prompt || voiceText,
        email,
        websiteType
      });
      setOutput(res.data.output);
      if (typeof res.data.output === 'object') {
        localStorage.setItem("generatedPages", JSON.stringify(res.data.output));
        localStorage.setItem("generatedCode", res.data.output['index.html'] || "");
      } else {
        localStorage.setItem("generatedCode", res.data.output);
      }
      fetchCredits(email);
    } catch (err) {
      if (err.response?.status === 429) {
        alert("Server is busy! Many users are generating websites. Please wait 1-2 minutes and try again.");
      } else if (err.response?.data?.error === "No website credits left") {
        alert("You've used all your credits! Click 'Get Free Credits' to get 3 free website generations.");
      } else {
        alert(err.response?.data?.error || "Generation failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const claimFreeCredits = async () => {
    try {
      await axios.post(`${API_URL}/api/add-free-credits`, { email });
      fetchCredits(email);
      alert("3 free credits added!");
    } catch (err) {
      alert("Failed to add credits");
    }
  };

  const startRecording = async () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    
    let finalTranscript = "";
    
    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      setVoiceText(finalTranscript + interimTranscript);
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "no-speech") {
        setVoiceText("No speech detected. Please try again.");
      } else if (event.error === "not-allowed") {
        setVoiceText("Microphone access denied. Please allow microphone access.");
      } else {
        setVoiceText("Speech recognition error. Please type your idea instead.");
      }
      setRecording(false);
    };
    
    recognition.onend = () => {
      setRecording(false);
      if (!voiceText && finalTranscript) {
        setVoiceText(finalTranscript);
      }
    };
    
    recognition.start();
    setMediaRecorder(recognition);
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      if (mediaRecorder.stop) {
        mediaRecorder.stop();
      } else {
        mediaRecorder.abort();
      }
      setRecording(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  if (!mode) {
    return (
      <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
        <div className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2" style={{ willChange: "transform" }}>
          <div className="w-2 h-2 rounded-full bg-violet-400" />
        </div>
        <div className="pointer-events-none fixed top-0 left-0 z-[9998] -translate-x-1/2 -translate-y-1/2" style={{ willChange: "transform" }}>
          <div className="w-8 h-8 rounded-full border border-violet-500/50" style={{ mixBlendMode: "difference" }} />
        </div>
        <div ref={dotRef} />
        <div ref={ringRef} />
        
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
        
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-violet-700/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-56 h-56 bg-fuchsia-700/15 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative max-w-6xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-300 bg-clip-text text-transparent">
                Lova AI
              </h1>
              <p className="text-zinc-500 mt-1">Welcome, {email?.split("@")[0]}</p>
            </div>
            <div className="flex items-center gap-4">
              {credits.websites > 0 ? (
                <div className="bg-gradient-to-r from-violet-900/50 to-fuchsia-900/50 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-full flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span className="text-white font-medium">{credits.websites}</span>
                  <span className="text-zinc-400 text-sm">credits left</span>
                </div>
              ) : (
                <button
                  onClick={claimFreeCredits}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 px-5 py-2.5 rounded-full font-medium flex items-center gap-2 shadow-lg shadow-green-500/30"
                >
                  <Zap className="w-4 h-4" />
                  Get Free Credits
                </button>
              )}
              <button onClick={handleLogout} className="px-4 py-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition">
                Sign Out
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => setMode("speech")}
              className="group relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-10 hover:border-violet-500/30 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-violet-500/10 to-violet-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-violet-500/30">
                  <Volume2 className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Speech to Website</h2>
                <p className="text-zinc-400 mb-4">Describe your idea with voice and watch it transform into a stunning website</p>
                <div className="flex items-center gap-2 text-violet-400 text-sm">
                  <span>Get started</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>

            <button
              onClick={() => setMode("ideas")}
              className="group relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-10 hover:border-fuchsia-500/30 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/0 via-fuchsia-500/10 to-fuchsia-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-[-3deg] transition-all duration-300 shadow-lg shadow-fuchsia-500/30">
                  <Lightbulb className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Pure Ideas</h2>
                <p className="text-zinc-400 mb-4">Type your vision and let AI craft the perfect website structure</p>
                <div className="flex items-center gap-2 text-fuchsia-400 text-sm">
                  <span>Get started</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => navigate("/projects")} className="flex items-center gap-2 text-zinc-400 hover:text-white transition group">
              <History className="w-5 h-5 group-hover:scale-110 transition" />
              <span>View Projects</span>
            </button>
            <div className="w-px h-4 bg-zinc-700" />
            <button onClick={() => navigate("/billing")} className="flex items-center gap-2 text-zinc-400 hover:text-white transition group">
              <Zap className="w-5 h-5 group-hover:scale-110 transition" />
              <span>Get Credits</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="relative max-w-4xl mx-auto px-6 py-8">
        <button 
          onClick={() => { setMode(null); setOutput(""); setPrompt(""); setVoiceText(""); }} 
          className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {mode === "speech" ? (
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Speech to Website</span>
            ) : (
              <span className="bg-gradient-to-r from-fuchsia-400 to-orange-400 bg-clip-text text-transparent">Pure Ideas</span>
            )}
          </h1>
          <p className="text-zinc-400">Create your website in seconds</p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-6">
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setWebsiteType("html")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${websiteType === "html" ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30" : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"}`}
            >
              <Code className="w-4 h-4" /> HTML/CSS
            </button>
            <button
              onClick={() => setWebsiteType("react")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${websiteType === "react" ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/30" : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"}`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 01-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.37 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m2.01-3.2c.44.7.81 1.46 1.13 2.27.38-.02.76-.06 1.15-.11-.28-.37-.58-.73-.9-1.08l-1.38-1.08M9.3 18.2c-.38.02-.76.06-1.15.11.28.37.58.73.9 1.08l1.38 1.08c-.44-.7-.81-1.46-1.13-2.27m3.15-9.48c-.57.29-1.15.6-1.72.94.57.34 1.15.65 1.72.94.57-.29 1.15-.6 1.72-.94-.57-.34-1.15-.65-1.72-.94"/>
              </svg>
              React
            </button>
          </div>

          {mode === "speech" && (
            <div className="mb-6">
              <div className="flex flex-col items-center mb-6">
                <button
                  onClick={recording ? stopRecording : startRecording}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${recording ? "bg-red-600 animate-pulse shadow-lg shadow-red-500/50 scale-110" : "bg-gradient-to-br from-violet-600 to-fuchsia-600 hover:scale-105 shadow-lg shadow-violet-500/30"}`}
                >
                  <Mic className={`w-10 h-10 ${recording ? "" : ""}`} />
                </button>
                <span className="mt-4 text-zinc-400">{recording ? "Listening... Tap to stop" : "Tap to speak your idea"}</span>
              </div>
              {voiceText && (
                <div className="bg-gradient-to-r from-violet-900/30 to-fuchsia-900/30 border border-violet-500/20 p-5 rounded-2xl">
                  <p className="text-violet-100 text-lg leading-relaxed">{voiceText}</p>
                </div>
              )}
            </div>
          )}

          {mode === "ideas" && (
            <div className="mb-6">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your website idea... (e.g., 'A landing page for a coffee shop with menu, hours, and location sections')"
                className="w-full h-40 p-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-zinc-500 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 outline-none transition resize-none"
              />
              <div className="mt-2 text-xs text-zinc-500">
                {prompt.length}/500 characters
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || credits.websites <= 0 || (!prompt.trim() && !voiceText.trim())}
            className="w-full py-4 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-violet-500 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 relative overflow-hidden group"
          >
            <span className={`transition-opacity ${loading ? "opacity-0" : "opacity-100"}`}>
              {credits.websites <= 0 ? "No Credits Left" : (loading ? "Generating..." : "Generate Website")}
            </span>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </button>
        </div>

        {output && (
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                Your Website is Ready!
              </h2>
              <div className="flex gap-3">
                <button onClick={() => navigate("/preview")} className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-medium transition flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Preview
                </button>
                <button onClick={() => navigate("/deploy")} className="px-5 py-2.5 bg-green-600 hover:bg-green-500 rounded-xl text-sm font-medium transition flex items-center gap-2">
                  Download
                </button>
              </div>
            </div>
            <div className="bg-black/40 rounded-2xl p-4 overflow-auto max-h-80">
              <pre className="text-sm text-zinc-300 font-mono whitespace-pre-wrap">{output}</pre>
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      `}</style>
    </div>
  );
}
