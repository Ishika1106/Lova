import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { Terminal } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-lg border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-zinc-900 border border-zinc-700/60 rounded-lg flex items-center justify-center group-hover:border-violet-500/50 transition-colors duration-300">
            <Terminal className="w-5 h-5 text-violet-400" />
          </div>
          <span
            className="text-2xl font-semibold tracking-tighter"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Lova
          </span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium text-zinc-400">
          {["How it Works", "About", "Pricing"].map((label, i) => {
            const hrefs = ["#how", "#about", "/billing"];
            return (
              <a
                key={label}
                href={hrefs[i]}
                className="relative group hover:text-white transition-colors duration-200"
              >
                {label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-violet-400 group-hover:w-full transition-all duration-300" />
              </a>
            );
          })}
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="px-5 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-semibold transition-all duration-200"
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 text-sm text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-5 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-violet-400 hover:text-white transition-all duration-200"
              >
                Get Started Free
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}