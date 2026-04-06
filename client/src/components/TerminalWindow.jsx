"use client";
import { useEffect, useState } from "react";

/* ---------------- DATA ---------------- */
const LINES = [
  { delay: 0, text: "$ lova build student-portfolio", type: "cmd" },
  { delay: 700, text: " Connecting to Groq...", type: "info" },
  { delay: 1400, text: " Understanding prompt...", type: "info" },
  { delay: 2100, text: " Generating layout...", type: "info" },
  { delay: 2800, text: " Creating components...", type: "info" },
  { delay: 3500, text: " Applying Tailwind styles...", type: "info" },
  { delay: 4200, text: " Optimising responsiveness...", type: "info" },
  { delay: 4900, text: " Done in 3.8s", type: "success" },
];

const TASKS = [
  { id: 1, title: "Two Sum + 2 variants", sub: "LeetCode · Arrays", tag: "dsa", done: false },
  { id: 2, title: "Push ML model to GitHub", sub: "Sentiment Analyser v2", tag: "proj", done: false },
  { id: 3, title: "OS lecture — memory mgmt", sub: "Chapter 8 · 40 mins", tag: "core", done: true },
  { id: 4, title: "DSA assignment #3 submit", sub: "Due 11:59 PM", tag: "sys", done: false },
];

const PROJECTS = [
  { name: "Sentiment Analyser", stack: "Python · FastAPI · Transformers", status: "build", pct: 62, cyan: false, commits: 14, days: 12 },
  { name: "Campus Fare Tracker", stack: "React · Node · Mongo", status: "live", pct: 91, cyan: false, commits: 37, days: 45 },
  { name: "Shell in C", stack: "C · Linux · Make", status: "build", pct: 38, cyan: true, commits: 9, days: 7 },
  { name: "Distributed KV Store", stack: "Go · gRPC · Raft", status: "idea", pct: 5, cyan: false, commits: 1, days: 2 },
];

const PROBS = [
  { name: "Trapping Rain Water", diff: "hard", tag: "DP" },
  { name: "LRU Cache", diff: "med", tag: "Design" },
  { name: "Valid Parentheses", diff: "easy", tag: "Stack" },
  { name: "Merge K Sorted Lists", diff: "hard", tag: "Heap" },
];

const HEAT = Array.from({ length: 28 }, () => {
  const r = Math.random();
  return r < 0.2 ? "" : r < 0.45 ? "h1" : r < 0.65 ? "h2" : r < 0.82 ? "h3" : "h4";
});

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const TODAY_IDX = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
// eslint-disable-next-line no-unused-vars
function nowTime() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

const LOVA_TABS = [
  { id: "today", label: "today" },
  { id: "projects", label: "projects" },
  { id: "grind", label: "grind" },
];

/* ---------------- TYPED LINE ---------------- */
function TypedLine({ text, type, active }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!active) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [active, text]);

  const color =
    type === "cmd"
      ? "text-purple-300"
      : type === "success"
      ? "text-green-400"
      : "text-gray-400";

  return (
    <div className={`font-mono text-sm ${color}`}>
      {displayed}
      {active && displayed.length < text.length && (
        <span className="inline-block w-1.5 h-4 bg-purple-400 ml-1 animate-pulse" />
      )}
    </div>
  );
}

/* ---------------- TERMINAL ---------------- */
function Terminal({ onDone }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timers = LINES.map((line, i) =>
      setTimeout(() => setVisibleCount(i + 1), line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          setTimeout(onDone, 1400);
          return 100;
        }
        return p + 2;
      });
    }, 140);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <div className="bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-400" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-3 text-xs text-gray-400 font-mono">lova — ai builder</span>
      </div>

      <div className="p-5 space-y-3">
        {LINES.slice(0, visibleCount).map((line, i) => (
          <TypedLine key={i} text={line.text} type={line.type} active={i === visibleCount - 1} />
        ))}

        <div className="pt-2">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- DASHBOARD COMPONENTS ---------------- */
function TodayTab() {
  const [tasks, setTasks] = useState(TASKS);
  const toggle = (id) =>
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const doneCount = tasks.filter((t) => t.done).length;
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="p-5 space-y-4 bg-[#111] rounded-2xl text-gray-200">
      <div className="flex justify-between items-end">
        <div>
          <div className="text-sm text-gray-400">{today}</div>
          <div className="text-2xl font-light">
            Good grind, <strong className="font-medium">CodeID_07</strong>.
          </div>
        </div>
        <div className="bg-pink-900/30 border border-pink-600 text-pink-300 rounded-md px-3 py-1 text-center text-xs">
          +120 xp today
        </div>
      </div>

      <div>
        <div className="text-xs text-gray-400 mb-2">7-day streak</div>
        <div className="flex gap-2">
          {DAYS.map((d, i) => (
            <div
              key={i}
              className={`flex-1 h-7 rounded-md relative ${
                i < TODAY_IDX ? "bg-pink-700/20" : ""
              } ${i === TODAY_IDX ? "border border-pink-400" : ""}`}
            >
              <div className="absolute bottom-1 w-full text-center text-[8px] text-gray-400">{d}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs text-gray-400 mb-2">
          Focus blocks · {doneCount}/{tasks.length} done
        </div>
        <div className="flex flex-col gap-2">
          {tasks.map((t) => (
            <div
              key={t.id}
              onClick={() => toggle(t.id)}
              className={`flex items-center gap-3 p-3 rounded-md border border-gray-700 ${
                t.done ? "opacity-50" : ""
              }`}
            >
              <div
                className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center text-xs ${
                  t.done ? "bg-pink-500 border-pink-500 text-white" : "border-gray-600"
                }`}
              >
                {t.done && "✓"}
              </div>
              <div className="flex-1">
                <div className="text-sm">{t.title}</div>
                <div className="text-xs text-gray-400">{t.sub}</div>
              </div>
              <div className="text-[9px] px-2 py-0.5 rounded-md bg-pink-700/20 text-pink-300 border border-pink-600">
                {t.tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsTab() {
  return (
    <div className="p-5 space-y-4 bg-[#111] rounded-2xl text-gray-200">
      <div className="text-xs text-gray-400 mb-2">Active projects · {PROJECTS.length}</div>
      {PROJECTS.map((p, i) => (
        <div key={i} className="bg-[#1a1a1a]/50 border border-gray-700 rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium">{p.name}</div>
              <div className="text-[9px] text-gray-400 mt-1">{p.stack}</div>
            </div>
            <div className={`text-[9px] px-2 py-0.5 rounded-md border ${
              p.status === "live"
                ? "bg-pink-700/20 text-pink-300 border-pink-600"
                : p.status === "build"
                ? "bg-pink-800/30 text-pink-300 border-pink-600"
                : "bg-gray-800/30 text-gray-400 border-gray-700"
            }`}>
              {p.status}
            </div>
          </div>
          <div className="w-full h-2 bg-gray-800/30 rounded-full overflow-hidden">
            <div
              className={`h-full ${p.cyan ? "bg-cyan-400" : "bg-pink-500"} transition-all`}
              style={{ width: `${p.pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-gray-400">
            <span>{p.pct}% complete</span>
            <span>{p.commits} commits</span>
            <span>{p.days}d active</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- GRIND TAB ---------------- */
function GrindTab() {
  return (
    <div className="p-5 space-y-4 bg-[#111] rounded-2xl text-gray-200">
      <div className="text-xs text-gray-400 mb-2">DSA stats</div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1a1a1a]/50 p-3 rounded-lg text-center">
          <div className="font-mono text-xl font-medium">247</div>
          <div className="font-mono text-[9px] text-gray-400 mt-1">solved</div>
        </div>
        <div className="bg-[#1a1a1a]/50 p-3 rounded-lg text-center">
          <div className="font-mono text-xl font-medium">12</div>
          <div className="font-mono text-[9px] text-gray-400 mt-1">streak</div>
        </div>
        <div className="bg-[#1a1a1a]/50 p-3 rounded-lg text-center">
          <div className="font-mono text-xl font-medium">84%</div>
          <div className="font-mono text-[9px] text-gray-400 mt-1">accuracy</div>
        </div>
      </div>

      <div className="text-xs text-gray-400 mb-2">28-day activity</div>
      <div className="grid grid-cols-7 gap-1">
        {HEAT.map((h, i) => (
          <div
            key={i}
            className={`aspect-square w-full rounded-sm ${
              h === "h1"
                ? "bg-pink-700/30"
                : h === "h2"
                ? "bg-pink-700/50"
                : h === "h3"
                ? "bg-pink-700/70"
                : h === "h4"
                ? "bg-pink-500"
                : "bg-[#1a1a1a]/20"
            }`}
          />
        ))}
      </div>

      <div className="text-xs text-gray-400 mb-2">Recent problems</div>
      {PROBS.map((p, i) => (
        <div key={i} className="flex items-center gap-2 p-2 rounded-md border border-gray-700">
          <div className={`text-[9px] px-2 py-0.5 rounded-md ${
            p.diff === "easy"
              ? "bg-green-100 text-green-600 border border-green-200"
              : p.diff === "med"
              ? "bg-yellow-100 text-yellow-600 border border-yellow-200"
              : "bg-pink-100 text-pink-600 border border-pink-200"
          }`}>{p.diff}</div>
          <div className="flex-1 text-sm">{p.name}</div>
          <div className="text-[9px] text-gray-400 font-mono">{p.tag}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */
function Dashboard({ tab, setTab }) {
  return (
    <div className="space-y-4">
      <div className="flex border-b border-gray-700">
        {LOVA_TABS.map((t) => (
          <button
            key={t.id}
            className={`flex-1 px-3 py-2 text-xs font-mono uppercase tracking-wide border-b-2 transition-colors ${
              tab === t.id
                ? "border-pink-500 text-pink-400"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "today" && <TodayTab />}
      {tab === "projects" && <ProjectsTab />}
      {tab === "grind" && <GrindTab />}
    </div>
  );
}

/* ---------------- MAIN ---------------- */
export default function LovaDemo() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [tab, setTab] = useState("today");

  return (
    <div className="relative w-full max-w-[600px] mx-auto px-4 sm:px-6 md:px-0">
      <div className="relative">
        <div
          className={`transition-all duration-700 ${
            showDashboard ? "opacity-0 translate-y-6 pointer-events-none" : "opacity-100 translate-y-0"
          }`}
        >
          <Terminal onDone={() => setShowDashboard(true)} />
        </div>

        <div
          className={`absolute inset-0 transition-all duration-700 ${
            showDashboard ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6 pointer-events-none"
          }`}
        >
          <Dashboard tab={tab} setTab={setTab} />
        </div>
      </div>
    </div>
  );
}