import { useNavigate } from "react-router";
import {
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  Flame,
  BookOpen,
  Star,
  ChevronRight,
  Zap,
} from "lucide-react";

const subjectProgress = [
  { subject: "Algebra", percent: 85, color: "#34C759", status: "Strong" },
  { subject: "Functions", percent: 42, color: "#FFD60A", status: "Weak ⚠️" },
  { subject: "Limits", percent: 78, color: "#34C759", status: "Good" },
  { subject: "Differentiation", percent: 18, color: "#FF3B30", status: "Critical ❌" },
  { subject: "Integration", percent: 5, color: "#0A84FF", status: "Starting" },
  { subject: "Trigonometry", percent: 55, color: "#FFD60A", status: "Weak ⚠️" },
  { subject: "Matrices", percent: 0, color: "#888", status: "Not Started" },
  { subject: "Probability", percent: 91, color: "#34C759", status: "Strong ✅" },
];

const weakConcepts = [
  {
    title: "DIFFERENTIATION",
    desc: "Your foundation is critical",
    hint: "Fix this FIRST →",
    color: "#FF3B30",
    shadow: "#cc2e25",
    icon: "❌",
  },
  {
    title: "FUNCTIONS",
    desc: "Your foundation is weak",
    hint: "Review basics →",
    color: "#FFD60A",
    shadow: "#ccaa00",
    icon: "⚠️",
  },
  {
    title: "TRIGONOMETRY",
    desc: "Needs more practice",
    hint: "Practice exercises →",
    color: "#FFD60A",
    shadow: "#ccaa00",
    icon: "⚠️",
  },
];

const learningPath = [
  { label: "ALGEBRA", status: "done", color: "#34C759" },
  { label: "FUNCTIONS", status: "weak", color: "#FFD60A" },
  { label: "LIMITS", status: "done", color: "#34C759" },
  { label: "DIFFERENTIATION", status: "critical", color: "#FF3B30" },
  { label: "INTEGRATION", status: "next", color: "#0A84FF" },
];

const recentActivity = [
  { action: "Completed Quiz", topic: "Algebra — Chapter 3", score: 92, time: "2h ago", ok: true },
  { action: "Attempted Quiz", topic: "Functions — Chapter 1", score: 41, time: "Yesterday", ok: false },
  { action: "Watched Lecture", topic: "Limits — Introduction", score: null, time: "Yesterday", ok: true },
  { action: "Completed Quiz", topic: "Probability — Basics", score: 88, time: "2 days ago", ok: true },
];

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Hero */}
      <div className="bg-black border-4 border-black p-6 shadow-[8px_8px_0px_#FFD60A] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-40 h-40 bg-[#FFD60A] opacity-10 rounded-full translate-x-10 -translate-y-10" />
        <div className="relative z-10">
          <div className="text-[#FFD60A] font-black text-xs uppercase tracking-widest mb-2">
            📍 Welcome back, Alex!
          </div>
          <h1 className="text-white font-black text-3xl md:text-4xl uppercase leading-tight mb-3">
            Ready to Level<br />Up Today? ⚡
          </h1>
          <p className="text-white/70 font-bold text-sm mb-5">
            You have 3 weak topics to fix and 2 new lessons waiting.
          </p>
          <button
            onClick={() => navigate("/practice")}
            className="bg-[#FFD60A] border-3 border-[#FFD60A] px-6 py-3 font-black text-black text-sm uppercase tracking-wide shadow-[5px_5px_0px_white] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-100 flex items-center gap-2"
          >
            <Zap className="w-4 h-4" /> Start Learning ➜
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Overall Score", value: "67%", icon: Target, bg: "#0A84FF", text: "#fff", shadow: "#0060CC" },
          { label: "Topics Mastered", value: "3/8", icon: CheckCircle2, bg: "#34C759", text: "#000", shadow: "#28A046" },
          { label: "Study Hours", value: "24h", icon: Clock, bg: "#FFD60A", text: "#000", shadow: "#ccaa00" },
          { label: "Current Streak", value: "14 🔥", icon: Flame, bg: "#FF3B30", text: "#fff", shadow: "#cc2e25" },
        ].map(({ label, value, icon: Icon, bg, text, shadow }) => (
          <div
            key={label}
            style={{ backgroundColor: bg, boxShadow: `5px 5px 0px ${shadow}` }}
            className="border-3 border-black p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-black flex items-center justify-center">
                <Icon className="w-4 h-4" style={{ color: bg }} />
              </div>
            </div>
            <div
              className="font-black text-2xl md:text-3xl leading-none mb-1"
              style={{ color: text }}
            >
              {value}
            </div>
            <div
              className="font-bold text-xs uppercase tracking-wide"
              style={{ color: text, opacity: 0.8 }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Main content: Progress + Weak Concepts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress bars */}
        <div className="lg:col-span-2 bg-white border-4 border-black p-5 shadow-[6px_6px_0px_black]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black text-black text-lg uppercase tracking-wide flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Progress Overview
            </h2>
            <button
              onClick={() => navigate("/analytics")}
              className="text-xs font-black uppercase tracking-wide border-2 border-black px-3 py-1.5 bg-[#FFD60A] shadow-[3px_3px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              Full Report ➜
            </button>
          </div>
          <div className="space-y-4">
            {subjectProgress.map(({ subject, percent, color, status }) => (
              <div key={subject}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-black text-sm text-black uppercase tracking-wide">{subject}</span>
                  <span
                    className="text-xs font-black px-2 py-0.5 border-2 border-black"
                    style={{ backgroundColor: color, color: color === "#FFD60A" || color === "#34C759" ? "#000" : "#fff" }}
                  >
                    {status}
                  </span>
                </div>
                <div className="h-6 bg-[#F0F0F0] border-3 border-black relative overflow-hidden">
                  <div
                    className="h-full border-r-3 border-black transition-all duration-700"
                    style={{ width: `${percent}%`, backgroundColor: color }}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-black text-black">
                    {percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak concepts */}
        <div className="space-y-4">
          <h2 className="font-black text-black text-lg uppercase tracking-wide flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#FF3B30]" /> Weak Areas
          </h2>
          {weakConcepts.map(({ title, desc, hint, color, shadow, icon }) => (
            <div
              key={title}
              style={{ backgroundColor: color, boxShadow: `5px 5px 0px ${shadow}` }}
              className="border-3 border-black p-4 cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              onClick={() => navigate("/practice")}
            >
              <div className="text-2xl mb-1">{icon}</div>
              <div className="font-black text-black text-base uppercase tracking-wide leading-tight">{title}</div>
              <div className="text-black/70 font-bold text-xs mt-1 mb-2">{desc}</div>
              <div className="flex items-center gap-1 font-black text-xs text-black uppercase">
                {hint} <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Path */}
      <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_black]">
        <h2 className="font-black text-black text-lg uppercase tracking-wide mb-5 flex items-center gap-2">
          <BookOpen className="w-5 h-5" /> Suggested Learning Path
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          {learningPath.map(({ label, status, color }, idx) => (
            <div key={label} className="flex items-center gap-3">
              <div
                style={{ backgroundColor: color, boxShadow: "4px 4px 0px black" }}
                className="border-3 border-black px-4 py-3 flex flex-col items-center min-w-[90px]"
              >
                <span className="font-black text-xs text-black uppercase tracking-wide">{label}</span>
                <span className="text-[10px] font-bold text-black/70 mt-0.5 capitalize">{status}</span>
              </div>
              {idx < learningPath.length - 1 && (
                <ChevronRight className="w-6 h-6 text-black font-black flex-shrink-0" strokeWidth={3} />
              )}
            </div>
          ))}
          <div className="flex items-center gap-3">
            <ChevronRight className="w-6 h-6 text-black flex-shrink-0" strokeWidth={3} />
            <div className="border-3 border-black border-dashed px-4 py-3 text-center min-w-[90px]">
              <span className="font-black text-xs text-black/40 uppercase tracking-wide">MORE...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_black]">
        <h2 className="font-black text-black text-lg uppercase tracking-wide mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" /> Recent Activity
        </h2>
        <div className="space-y-2">
          {recentActivity.map(({ action, topic, score, time, ok }, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-3 border-black p-3 hover:bg-[#F8F8F8] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 border-2 border-black flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: ok ? "#34C759" : "#FF3B30" }}
                >
                  {ok ? <CheckCircle2 className="w-4 h-4 text-white" /> : <AlertTriangle className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <div className="font-black text-black text-sm">{action}</div>
                  <div className="text-black/60 text-xs font-bold">{topic}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {score !== null && (
                  <div
                    className="border-2 border-black px-2 py-0.5 font-black text-sm"
                    style={{
                      backgroundColor: score >= 70 ? "#34C759" : "#FF3B30",
                      color: "#fff",
                    }}
                  >
                    {score}%
                  </div>
                )}
                <div className="text-black/40 text-xs font-bold hidden sm:block">{time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
