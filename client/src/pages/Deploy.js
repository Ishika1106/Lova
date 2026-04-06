"use client";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Check, FileCode, FileArchive, Globe } from "lucide-react";

export default function Deploy() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [projectName, setProjectName] = useState("");
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
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
    const savedCode = localStorage.getItem("generatedCode");
    if (savedCode) setCode(savedCode);
  }, []);

  const generateHTML = () => {
    const name = projectName.trim() || "lova-website";
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            display: ['Playfair Display', 'serif'],
            sans: ['DM Sans', 'sans-serif'],
            mono: ['Space Grotesk', 'monospace'],
            body: ['Manrope', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    * { scroll-behavior: smooth; }
    body { font-family: 'DM Sans', sans-serif; }
    img { max-width: 100%; height: auto; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
    @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); } 50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); } }
    .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
  </style>
</head>
<body>
  ${code}
</body>
</html>`;
  };

  const downloadHTML = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.trim() || "lova-website"}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const downloadZIP = () => {
    const html = generateHTML();
    const name = projectName.trim() || "lova-website";
    const zipContent = `data:text/html;base64,${btoa(unescape(encodeURIComponent(html)))}`;
    const a = document.createElement("a");
    a.href = zipContent;
    a.download = `${name}.zip`;
    a.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateHTML());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deploymentOptions = [
    {
      platform: "GitHub Pages",
      icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
      description: "Free hosting for static websites",
      steps: ["Create a new repository on GitHub", "Upload your HTML file", "Go to Settings → Pages → Enable", "Your site will be live at username.github.io/repo-name"]
    },
    {
      platform: "Netlify",
      icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M16.192 9.192c1.168-.588 1.88-1.12 2.208-1.768.328-.648.328-1.536.328-2.976 0-1.632-.12-2.4-.36-2.904-.24-.504-.84-.912-1.848-1.176V0h-3.6v1.2h1.2v1.776h-1.2v1.584H12v-1.584h-1.2V2.4H9.6V1.2h1.2V0H7.2v4.8H6v-1.2H4.8v2.4c-.576.12-1.08.36-1.584.72-.504.36-.84.84-1.056 1.44-.216.6-.36 1.416-.36 2.4 0 1.56.12 2.424.36 3.024.24.6.864 1.08 1.848 1.392V24h3.6v-1.2h1.2v-1.2H12v1.2h1.2v1.2h3.6V13.2c1.008-.312 1.632-.792 1.896-1.392.264-.6.36-1.464.36-3.024 0-1.44 0-2.328-.324-2.592z"/></svg>,
      description: "Drag and drop deployment",
      steps: ["Go to netlify.com/drop", "Drag and drop your HTML file", "Your site is instantly live", "Connect to Git for continuous deployment"]
    },
    {
      platform: "Vercel",
      icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M24 22.525H0l12-21.05 12 21.05z"/></svg>,
      description: "Fast global CDN deployment",
      steps: ["Go to vercel.com", "Sign up with GitHub or email", "Import your project", "Deploy with one click"]
    }
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

      <div className="relative max-w-5xl mx-auto px-6 py-8">
        <button onClick={() => navigate("/projects")} className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </button>

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Export & Deploy</span>
          </h1>
          <p className="text-zinc-400">Download your website or deploy it to the web</p>
        </div>

        {downloaded && (
          <div className="mb-6 bg-green-500/20 border border-green-500/30 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3 animate-fadeIn">
            <Check className="w-5 h-5 text-green-400" />
            <span className="text-green-300">Download started! Check your downloads folder.</span>
          </div>
        )}

        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
          <label className="block mb-2 text-zinc-300 font-medium">Website Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="my-awesome-website"
            className="w-full p-4 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:border-violet-500/50 outline-none transition"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <button
            onClick={downloadHTML}
            disabled={!code}
            className="group bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-all disabled:opacity-50"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-violet-500/30">
              <FileCode className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-lg font-bold mb-1">HTML File</h2>
            <p className="text-sm text-zinc-400">Single file - open in any browser</p>
          </button>

          <button
            onClick={downloadZIP}
            disabled={!code}
            className="group bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-green-500/30 transition-all disabled:opacity-50"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/30">
              <FileArchive className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-lg font-bold mb-1">ZIP Package</h2>
            <p className="text-sm text-zinc-400">Ready for hosting services</p>
          </button>

          <button
            onClick={copyCode}
            disabled={!code}
            className="group bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all disabled:opacity-50"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/30">
              {copied ? <Check className="w-7 h-7 text-white" /> : <Copy className="w-7 h-7 text-white" />}
            </div>
            <h2 className="text-lg font-bold mb-1">{copied ? "Copied!" : "Copy Code"}</h2>
            <p className="text-sm text-zinc-400">Copy HTML to clipboard</p>
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Globe className="w-6 h-6 text-violet-400" />
            Free Deployment Options
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {deploymentOptions.map((option) => (
              <div key={option.platform} className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 text-white">
                  {option.icon}
                </div>
                <h3 className="font-bold text-lg mb-1">{option.platform}</h3>
                <p className="text-sm text-zinc-400 mb-4">{option.description}</p>
                <ul className="space-y-2">
                  {option.steps.map((step, i) => (
                    <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-violet-600/30 text-violet-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {!code && (
          <div className="mt-12 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center">
            <FileCode className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">Generate a website first to download or deploy</p>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
