"use client";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
import API_URL from "../api";
import { ArrowLeft, Eye, Edit, Clock, FolderOpen, Sparkles, ExternalLink, Trash2 } from "lucide-react";

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
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
      fetchProjects(user.email);
    }
  }, []);

  const fetchProjects = async (email) => {
    try {
      const res = await axios.get(`${API_URL}/api/projects/${email}`);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectProject = (project) => {
    localStorage.setItem("generatedCode", project.generated_code);
    localStorage.setItem("currentProjectId", project.id);
    localStorage.setItem("modificationCount", project.modification_count || 0);
    // Try to parse as JSON, if fails store as single page
    try {
      const parsed = JSON.parse(project.generated_code);
      localStorage.setItem("generatedPages", JSON.stringify(parsed));
    } catch {
      localStorage.setItem("generatedPages", null);
    }
  };

  const deleteProject = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`${API_URL}/project/${id}`);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

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
      
      <div className="relative max-w-6xl mx-auto px-6 py-8">
        <button onClick={() => navigate("/dashboard")} className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Your Projects</span>
          </h1>
          <p className="text-zinc-400">{projects.length} websites created</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-zinc-400">Loading your projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-900/50 to-fuchsia-900/50 flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="w-12 h-12 text-violet-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No projects yet</h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">Start creating amazing websites with AI. Describe your idea and watch the magic happen.</p>
            <button 
              onClick={() => navigate("/dashboard")} 
              className="px-8 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold transition shadow-lg shadow-violet-500/20"
            >
              Create Your First Website
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                className="group relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="text-xs text-zinc-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatDate(project.created_at)}
                  </span>
                  <button
                    onClick={(e) => deleteProject(project.id, e)}
                    className="p-2 text-zinc-500 hover:text-red-400 transition rounded-lg hover:bg-red-500/10"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6 text-violet-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-white group-hover:text-violet-300 transition-colors pr-16">
                    {project.prompt?.substring(0, 30) || "Untitled Project"}{project.prompt?.length > 30 ? "..." : ""}
                  </h3>
                </div>
                
                <p className="text-sm text-zinc-400 mb-6 line-clamp-2 leading-relaxed">{project.prompt}</p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => { selectProject(project); navigate("/preview"); }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-violet-600/20 hover:bg-violet-600 border border-violet-500/30 hover:border-violet-400 rounded-xl text-sm font-medium transition"
                  >
                    <Eye className="w-4 h-4" /> Preview
                  </button>
                  <button
                    onClick={() => { selectProject(project); navigate("/modify"); }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-fuchsia-600/20 hover:bg-fuchsia-600 border border-fuchsia-500/30 hover:border-fuchsia-400 rounded-xl text-sm font-medium transition"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => { selectProject(project); navigate("/deploy"); }}
                    className="px-4 py-3 bg-green-600/20 hover:bg-green-600 border border-green-500/30 hover:border-green-400 rounded-xl text-sm font-medium transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
