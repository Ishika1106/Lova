import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { ArrowRight, ChevronDown } from "lucide-react";
import TerminalWindow from "./TerminalWindow";

export default function Hero() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleGetStarted = () => {
    navigate(user ? "/dashboard" : "/signup");
  };

  return (
    <>
      {/* ── Top hero: text left / terminal right ─────────────────────── */}
      <section className="min-h-screen pt-28 pb-20 flex items-center relative overflow-hidden">
        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Ambient glow blobs */}
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-violet-700/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-56 h-56 bg-fuchsia-700/15 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left — copy */}
          <div className="space-y-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border border-violet-500/30 bg-violet-500/5 text-violet-300 tracking-wide uppercase"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Powered by Grok from xAI
            </div>

            <h1
              className="text-[clamp(2.8rem,6vw,5rem)] font-bold leading-[1.06] tracking-tighter"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Your idea.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
                Beautiful site
              </span>
              <br />
              in seconds.
            </h1>

            <p className="text-lg text-zinc-400 max-w-md leading-relaxed">
              Describe what you want in plain English. Lova instantly builds
              modern, responsive Tailwind websites that actually look good.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleGetStarted}
                className="group flex items-center justify-center gap-2 px-8 py-3.5 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-violet-600/25"
              >
                Start building free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() =>
                  document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex items-center justify-center gap-2 px-8 py-3.5 border border-white/10 hover:border-white/20 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white transition-all duration-200"
              >
                How it works
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Social proof */}
            <p className="text-xs text-zinc-600 pt-2">
              No credit card required &nbsp;·&nbsp; Ships real HTML + Tailwind
            </p>
          </div>

          {/* Right — terminal */}
          <div className="flex justify-center md:justify-end">
            <TerminalWindow />
          </div>
        </div>
      </section>

      {/* ── Full-width hero image at the bottom ───────────────────────── */}
      <div className="relative w-full overflow-hidden">
        {/* Fade out top edge so it bleeds into the dark section above */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#050505] to-transparent z-10 pointer-events-none" />

        <img
          src="/hero.png"
          alt="Lova – AI Website Builder preview"
          className="w-full object-cover object-top"
          style={{ maxHeight: "560px" }}
        />

        {/* Fade out bottom edge into the next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0b] to-transparent z-10 pointer-events-none" />
      </div>
    </>
  );
}