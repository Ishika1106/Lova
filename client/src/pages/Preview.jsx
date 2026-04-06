"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Edit, ExternalLink, Smartphone, Monitor, FileCode, FolderOpen, Code2 } from "lucide-react";

export default function Preview() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("desktop");
  const [currentPage, setCurrentPage] = useState("index.html");
  const [pages, setPages] = useState({});
  const [isReact, setIsReact] = useState(false);
  const [showFiles, setShowFiles] = useState(true);

  useEffect(() => {
    const savedPages = localStorage.getItem("generatedPages");
    const savedCode = localStorage.getItem("generatedCode");
    
    if (savedPages) {
      const parsed = JSON.parse(savedPages);
      setPages(parsed);
      const pageKeys = Object.keys(parsed);
      if (pageKeys.length > 0) {
        setCurrentPage(pageKeys[0]);
      }
    } else if (savedCode) {
      if (savedCode.includes("import React")) {
        setIsReact(true);
      } else {
        setPages({ "index.html": savedCode });
        setCurrentPage("index.html");
      }
    }
  }, []);

  const getCurrentCode = () => {
    if (isReact) return localStorage.getItem("generatedCode") || "";
    return pages[currentPage] || "";
  };

  const downloadAllFiles = () => {
    if (isReact) {
      const reactHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React App</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${(localStorage.getItem("generatedCode") || "").replace(/import .* from .*/g, '').replace(/export default .*/g, '')}
    ReactDOM.render(<App />, document.getElementById('root'));
  </script>
</body>
</html>`;
      const blob = new Blob([reactHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "react-app.html";
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const zipContent = Object.entries(pages).map(([filename, content]) => {
      return `--- ${filename} ---\n${content}`;
    }).join('\n\n');
    
    const blob = new Blob([zipContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "website-files.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadSingleFile = (filename, content) => {
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSrcDoc = (code) => {
    if (!code) return "";
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lova Website</title>
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
    * { scroll-behavior: smooth; box-sizing: border-box; }
    body { font-family: 'DM Sans', sans-serif; margin: 0; padding: 0; }
    img { max-width: 100%; height: auto; display: block; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
    @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); } 50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
    .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
    .animate-slideIn { animation: slideIn 0.6s ease-out forwards; }
    .animate-scaleIn { animation: scaleIn 0.5s ease-out forwards; }
  </style>
</head>
<body style="background: white;">
  ${code}
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      document.querySelectorAll('img').forEach(function(img) {
        if (img.complete) {
          img.style.opacity = '1';
        } else {
          img.onload = function() { img.style.opacity = '1'; };
          img.onerror = function() { img.style.opacity = '0.5'; img.alt = 'Image not found'; };
        }
      });
    });
  </script>
</body>
</html>`;
  };

  const pageKeys = Object.keys(pages);
  const iframeHeight = viewMode === "mobile" ? "h-[667px]" : "h-[calc(100vh-140px)]";

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2" style={{ willChange: "transform" }}>
        <div className="w-2 h-2 rounded-full bg-violet-400" />
      </div>
      <div className="pointer-events-none fixed top-0 left-0 z-[9998] -translate-x-1/2 -translate-y-1/2" style={{ willChange: "transform" }}>
        <div className="w-8 h-8 rounded-full border border-violet-500/50" style={{ mixBlendMode: "difference" }} />
      </div>

      <div className="bg-white/[0.02] backdrop-blur-xl border-b border-white/10 px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-white transition group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="h-6 w-px bg-white/10 hidden md:block" />
            <span className="text-zinc-400 text-sm">Website Preview</span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
              <button
                onClick={() => setViewMode("desktop")}
                className={`p-2 rounded-lg transition ${viewMode === "desktop" ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"}`}
              >
                <Monitor className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("mobile")}
                className={`p-2 rounded-lg transition ${viewMode === "mobile" ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"}`}
              >
                <Smartphone className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-6 w-px bg-white/10 hidden md:block" />
            
            <button onClick={() => setShowFiles(!showFiles)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition ${showFiles ? "bg-violet-600" : "bg-white/5 hover:bg-white/10 border border-white/10"}`}>
              <FolderOpen className="w-4 h-4" /> 
              <span className="hidden sm:inline">Files</span>
            </button>
            
            <button onClick={() => navigate("/modify")} className="flex items-center gap-2 px-3 py-2 bg-fuchsia-600/20 hover:bg-fuchsia-600 border border-fuchsia-500/30 hover:border-fuchsia-400 rounded-xl text-sm transition">
              <Edit className="w-4 h-4" /> <span className="hidden sm:inline">Edit</span>
            </button>
            <button onClick={downloadAllFiles} className="flex items-center gap-2 px-3 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm transition">
              <Download className="w-4 h-4" /> <span className="hidden sm:inline">Download</span>
            </button>
            <button onClick={() => navigate("/deploy")} className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-500 rounded-xl text-sm transition">
              <ExternalLink className="w-4 h-4" /> <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {showFiles && pageKeys.length > 0 && !isReact && (
          <div className="w-full lg:w-64 bg-white/[0.02] border-b lg:border-b-0 lg:border-r border-white/10 p-4">
            <h3 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Project Files
            </h3>
            <div className="space-y-1">
              {pageKeys.map((filename) => (
                <button
                  key={filename}
                  onClick={() => setCurrentPage(filename)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${
                    currentPage === filename 
                      ? "bg-violet-600 text-white" 
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <FileCode className="w-4 h-4" />
                  {filename}
                </button>
              ))}
            </div>
            <button
              onClick={() => downloadSingleFile(currentPage, pages[currentPage])}
              className="w-full mt-4 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-zinc-400 hover:text-white transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Current
            </button>
          </div>
        )}

        <div className="flex-1 flex justify-center py-4 md:py-8 bg-[#050505] px-2 md:px-4">
          <div className={`w-full transition-all duration-300 ${viewMode === "mobile" ? "max-w-[375px]" : "max-w-full"}`}>
            {viewMode === "mobile" && (
              <div className="flex justify-center mb-4">
                <div className="w-[375px] h-[50px] bg-black/80 rounded-t-3xl flex items-center justify-center">
                  <div className="w-20 h-6 bg-black rounded-full" />
                </div>
              </div>
            )}
            <div className={`bg-white rounded-2xl overflow-hidden border border-white/10 transition-all ${viewMode === "mobile" ? "shadow-2xl shadow-violet-500/20" : ""}`}>
              {isReact ? (
                <div className="w-full h-[500px] bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0-01-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.37 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m2.01-3.2c.44.7.81 1.46 1.13 2.27.38-.02.76-.06 1.15-.11-.28-.37-.58-.73-.9-1.08l-1.38-1.08M9.3 18.2c-.38.02-.76.06-1.15.11.28.37.58.73.9 1.08l1.38 1.08c-.44-.7-.81-1.46-1.13-2.27m3.15-9.48c-.57.29-1.15.6-1.72.94.57.34 1.15.65 1.72.94.57-.29 1.15-.6 1.72-.94-.57-.34-1.15-.65-1.72-.94"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">React Project Generated</h3>
                  <p className="text-zinc-400 mb-6 max-w-md">This is a React project with components and state management.</p>
                  <div className="flex gap-4 flex-wrap justify-center">
                    <button onClick={downloadAllFiles} className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-medium transition">
                      <Download className="w-5 h-5" /> Download React Code
                    </button>
                    <button onClick={() => navigate("/deploy")} className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-medium transition">
                      <ExternalLink className="w-5 h-5" /> Deploy
                    </button>
                  </div>
                </div>
              ) : pageKeys.length > 0 ? (
                <iframe
                  srcDoc={getSrcDoc(getCurrentCode())}
                  className={`w-full border-0 ${iframeHeight}`}
                  title="Website Preview"
                />
              ) : (
                <div className="w-full h-[500px] bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center mb-6">
                    <FolderOpen className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">No Website Generated</h3>
                  <p className="text-zinc-400 mb-6 max-w-md">Generate a website first to see the preview.</p>
                  <button onClick={() => navigate("/dashboard")} className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-medium transition">
                    Go to Dashboard
                  </button>
                </div>
              )}
            </div>
            {viewMode === "mobile" && (
              <div className="flex justify-center mt-4">
                <div className="w-[375px] h-[50px] bg-black/80 rounded-b-3xl" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}