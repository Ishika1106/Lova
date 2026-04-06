import { Terminal, Zap, Palette } from "lucide-react";

const STEPS = [
  {
    icon: Terminal,
    step: "01",
    title: "Describe your idea",
    body: "Type what you want — a portfolio, SaaS landing, restaurant site, or anything else. Plain English works fine.",
  },
  {
    icon: Zap,
    step: "02",
    title: "Grok builds it",
    body: "Lova uses Grok to generate clean, modern HTML + Tailwind code in seconds. No templates, no boilerplate.",
  },
  {
    icon: Palette,
    step: "03",
    title: "Preview and export",
    body: "See a live preview, iterate on any section, then download or deploy your site.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-28 bg-[#0a0a0b]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="mb-20">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-violet-400 mb-4">
            The process
          </p>
          <h2
            className="text-5xl md:text-6xl font-bold tracking-tighter"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            How Lova works
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-px bg-white/[0.05] rounded-2xl overflow-hidden">
          {STEPS.map(({ icon: Icon, step, title, body }) => (
            <div
              key={step}
              className="group bg-[#0a0a0b] hover:bg-[#0f0f12] p-10 transition-colors duration-300 relative"
            >
              {/* Step number — large muted */}
              <span
                className="absolute top-8 right-10 text-6xl font-black text-white/[0.04] select-none"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {step}
              </span>

              <div className="w-11 h-11 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center mb-8 group-hover:border-violet-500/40 transition-colors">
                <Icon className="w-5 h-5 text-violet-400" />
              </div>

              <h3
                className="text-xl font-semibold mb-3 tracking-tight"
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