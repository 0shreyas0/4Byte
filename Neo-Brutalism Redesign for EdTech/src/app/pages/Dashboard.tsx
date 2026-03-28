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
  Sparkles,
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
      {/* Hero - Enhanced with Gradient */}
      <div className="relative overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-[#1a1a1a] to-black opacity-95" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD60A] opacity-5 rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#0A84FF] opacity-5 rounded-full blur-3xl" />
        
        <div className="relative z-10 border-4 border-black p-8 shadow-[8px_8px_0px_rgba(255,214,10,0.4)]">
          <div className="text-[#FFD60A] font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Welcome back, Alex!
          </div>
          <h1 className="text-white font-black text-4xl md:text-5xl uppercase leading-tight mb-4 tracking-tighter">
            Ready to Level<br /><span className="text-[#FFD60A]">Up Today?</span> ⚡
          </h1>
          <p className="text-white/80 font-bold text-base mb-6 max-w-md">
            You have <span className="text-[#FF3B30] font-black">3 weak topics</span> to fix and <span className="text-[#34C759] font-black">2 new lessons</span> waiting.
          </p>
          <button
            onClick={() => navigate("/practice")}
            className="bg-gradient-to-r from-[#FFD60A] to-[#FFC700] border-3 border-[#FFD60A] px-8 py-3 font-black text-black text-sm uppercase tracking-wide shadow-[6px_6px_0px_rgba(0,0,0,0.3)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,0.3)] transition-all duration-200 flex items-center gap-2 group"
          >
            <Zap className="w-5 h-5 group-hover:animate-pulse" /> Start Learning ➜
          </button>
        </div>
      </div>

      {/* Stats Grid - Enhanced */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Overall Score", value: "67%", icon: Target, bg: "from-[#0A84FF] to-[#0060CC]", text: "#fff", shadow: "#0052A3" },
          { label: "Topics Mastered", value: "3/8", icon: CheckCircle2, bg: "from-[#34C759] to-[#29A14D]", text: "#000", shadow: "#229A43" },
          { label: "Study Hours", value: "24h", icon: Clock, bg: "from-[#FFD60A] to-[#FFC700]", text: "#000", shadow: "#CCB200" },
          { label: "Current Streak", value: "14 🔥", icon: Flame, bg: "from-[#FF3B30] to-[#E63B21]", text: "#fff", shadow: "#CC3026" },
        ].map(({ label, value, icon: Icon, bg, text, shadow }) => (
          <div
            key={label}
            className={`bg-gradient-to-br ${bg} border-3 border-black p-5 shadow-[4px_4px_0px_rgba(0,0,0,0.15)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_rgba(0,0,0,0.15)] transition-all duration-200 group cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-black/20 flex items-center justify-center rounded transform group-hover:scale-110 transition-transform duration-200">
                <Icon className="w-5 h-5" style={{ color: text }} />
              </div>
            </div>
            <div
              className="font-black text-2xl md:text-3xl leading-none mb-2"
              style={{ color: text }}
            >
              {value}
            </div>
            <div
              className="font-bold text-xs uppercase tracking-wider"
              style={{ color: text, opacity: 0.85 }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Main content: Progress + Weak Concepts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress bars */}
        <div className="lg:col-span-2 bg-white border-4 border-black p-6 shadow-[6px_6px_0px_rgba(0,0,0,0.1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.15)] transition-shadow duration-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-black text-lg uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#0A84FF]" /> Progress Overview
            </h2>
            <button
              onClick={() => navigate("/analytics")}
              className="text-xs font-black uppercase tracking-wide border-3 border-black px-3 py-1.5 bg-[#FFD60A] shadow-[3px_3px_0px_rgba(0,0,0,0.1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_rgba(0,0,0,0.1)] transition-all duration-200"
            >
              Full Report ➜
            </button>
          </div>
          <div className="space-y-5">
            {subjectProgress.map(({ subject, percent, color, status }) => (
              <div key={subject}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-black text-sm text-black uppercase tracking-wide">{subject}</span>
                  <span
                    className="text-xs font-black px-2.5 py-1 border-2 border-black"
                    style={{ backgroundColor: color, color: color === "#FFD60A" || color === "#34C759" ? "#000" : "#fff" }}
                  >
                    {status}
                  </span>
                </div>
                <div className="h-7 bg-gray-200 border-3 border-black relative overflow-hidden shadow-[2px_2px_0px_rgba(0,0,0,0.05)]">
                  <div
                    className="h-full border-r-3 border-black/10 transition-all duration-700 relative overflow-hidden flex items-center justify-end pr-2"
                    style={{ width: `${percent}%`, backgroundColor: color }}
                  >
                    {percent > 20 && (
                      <span className="text-xs font-black text-black/70 text-right">
                        {percent}%
                      </span>
                    )}
                  </div>
                  {percent <= 20 && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-black text-black">
                      {percent}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak concepts */}
        <div className="space-y-4">
          <h2 className="font-black text-black text-lg uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#FF3B30]" /> Weak Areas
          </h2>
          {weakConcepts.map(({ title, desc, hint, color, shadow, icon }) => (
            <div
              key={title}
              style={{ backgroundColor: color, boxShadow: `5px 5px 0px ${shadow}` }}
              className="border-3 border-black p-5 cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_rgba(0,0,0,0.2)] transition-all duration-200 group"
              onClick={() => navigate("/practice")}
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">{icon}</div>
              <div className="font-black text-black text-base uppercase tracking-wide leading-tight">{title}</div>
              <div className="text-black/70 font-bold text-xs mt-1.5 mb-2.5">{desc}</div>
              <div className="flex items-center gap-1 font-black text-xs text-black uppercase group-hover:gap-2 transition-all">
                {hint} <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Path */}
      <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_rgba(0,0,0,0.1)]">
        <h2 className="font-black text-black text-lg uppercase tracking-wider mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#0A84FF]" /> Suggested Learning Path
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          {learningPath.map(({ label, status, color }, idx) => (
            <div key={label} className="flex items-center gap-3">
              <div
                style={{ backgroundColor: color, boxShadow: "4px 4px 0px rgba(0,0,0,0.1)" }}
                className="border-3 border-black px-4 py-3 flex flex-col items-center min-w-[100px] hover:shadow-[5px_5px_0px_rgba(0,0,0,0.15)] transition-shadow duration-200 group cursor-pointer"
              >
                <span className="font-black text-xs text-black uppercase tracking-wide leading-tight">{label}</span>
                <span className="text-[10px] font-bold text-black/60 mt-1 capitalize tracking-wider">{status}</span>
              </div>
              {idx < learningPath.length - 1 && (
                <ChevronRight className="w-6 h-6 text-black font-black flex-shrink-0 opacity-50" strokeWidth={3} />
              )}
            </div>
          ))}
          <div className="flex items-center gap-3">
            <ChevronRight className="w-6 h-6 text-black flex-shrink-0 opacity-30" strokeWidth={3} />
            <div className="border-3 border-black border-dashed px-4 py-3 text-center min-w-[100px]">
              <span className="font-black text-xs text-black/30 uppercase tracking-wide">More...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_rgba(0,0,0,0.1)]">
        <h2 className="font-black text-black text-lg uppercase tracking-wider mb-5 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#0A84FF]" /> Recent Activity
        </h2>
        <div className="space-y-2">
          {recentActivity.map(({ action, topic, score, time, ok }, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-3 border-black p-4 hover:bg-gradient-to-r hover:from-gray-50 to-transparent transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 border-2 border-black flex items-center justify-center flex-shrink-0 transform group-hover:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: ok ? "#34C759" : "#FF3B30" }}
                >
                  {ok ? <CheckCircle2 className="w-5 h-5 text-white" /> : <AlertTriangle className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <div className="font-black text-black text-sm uppercase tracking-wide">{action}</div>
                  <div className="text-black/60 text-xs font-bold mt-0.5">{topic}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {score !== null && (
                  <div
                    className="border-2 border-black px-3 py-1 font-black text-sm uppercase"
                    style={{
                      backgroundColor: score >= 70 ? "#34C759" : "#FF3B30",
                      color: "#fff",
                    }}
                  >
                    {score}%
                  </div>
                )}
                <div className="text-black/40 text-xs font-bold hidden sm:block min-w-[70px] text-right">{time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
