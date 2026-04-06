import { Zap, Palette, Code2 } from "lucide-react";

const CARDS = [
  {
    icon: Zap,
    title: "Lightning fast",
    body: "From prompt to full website in under 15 seconds using Grok. No waiting, no loading screens.",
  },
  {
    icon: Palette,
    title: "Stunning design",
    body: "Modern Tailwind CSS with pixel-perfect responsiveness baked in by default.",
  },
  {
    icon: Code2,
    title: "Clean code output",
    body: "Real HTML and Tailwind — no wrapper bloat. Copy, deploy, or extend however you want.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-28 bg-[#050505] relative overflow-hidden">
      {/* ambient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-800/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-start mb-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-violet-400 mb-4">
              About
            </p>
            <h2
              className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Meet Lova
            </h2>
          </div>
          <div className="flex items-end pb-1">
            <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
              Your intelligent AI build companion that turns any idea into a
              real website — beautifully, instantly, without the fluff.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {CARDS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group p-8 rounded-2xl border border-white/[0.06] hover:border-violet-500/30 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6 group-hover:border-violet-500/40 transition-colors">
                <Icon className="w-5 h-5 text-violet-400" />
              </div>
              <h3
                className="text-lg font-semibold mb-3 tracking-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {title}
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}