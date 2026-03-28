import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Clock,
  Zap,
  BarChart3,
  BookOpen,
} from "lucide-react";

const topicScores = [
  { topic: "Algebra",        score: 85, attempts: 6, fill: "#34C759" },
  { topic: "Functions",      score: 42, attempts: 4, fill: "#FFD60A" },
  { topic: "Limits",         score: 78, attempts: 5, fill: "#34C759" },
  { topic: "Trigonometry",   score: 55, attempts: 3, fill: "#FFD60A" },
  { topic: "Differentiation",score: 18, attempts: 2, fill: "#FF3B30" },
  { topic: "Integration",    score: 5,  attempts: 1, fill: "#0A84FF" },
  { topic: "Matrices",       score: 0,  attempts: 0, fill: "#E0E0E0" },
  { topic: "Probability",    score: 91, attempts: 7, fill: "#34C759" },
];

const weeklyData = [
  { day: "Mon", score: 72, questions: 12, time: 35 },
  { day: "Tue", score: 65, questions: 8,  time: 20 },
  { day: "Wed", score: 80, questions: 15, time: 45 },
  { day: "Thu", score: 58, questions: 6,  time: 18 },
  { day: "Fri", score: 88, questions: 18, time: 55 },
  { day: "Sat", score: 74, questions: 10, time: 30 },
  { day: "Sun", score: 91, questions: 20, time: 60 },
];

const monthlyProgress = [
  { week: "Wk 1", overall: 45 },
  { week: "Wk 2", overall: 52 },
  { week: "Wk 3", overall: 61 },
  { week: "Wk 4", overall: 67 },
];

const radarData = [
  { subject: "Algebra",       score: 85 },
  { subject: "Functions",     score: 42 },
  { subject: "Limits",        score: 78 },
  { subject: "Trig",          score: 55 },
  { subject: "Differentiate", score: 18 },
  { subject: "Probability",   score: 91 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border-3 border-black p-3 shadow-[4px_4px_0px_black]">
        <p className="font-black text-black text-xs uppercase mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="font-bold text-xs" style={{ color: p.color || "#000" }}>
            {p.name}: <span className="font-black">{p.value}{p.name === "score" || p.name === "overall" || p.name === "Score" ? "%" : p.name === "time" ? "min" : ""}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

type Tab = "overview" | "topics" | "weekly" | "radar";

export function Analytics() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview",  label: "Overview",   icon: <BarChart3 className="w-4 h-4" /> },
    { id: "topics",    label: "By Topic",   icon: <BookOpen className="w-4 h-4" /> },
    { id: "weekly",    label: "This Week",  icon: <Clock className="w-4 h-4" /> },
    { id: "radar",     label: "Radar",      icon: <Target className="w-4 h-4" /> },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-black text-black text-2xl md:text-3xl uppercase tracking-tight">
            📈 Analytics
          </h1>
          <p className="font-bold text-black/60 text-sm mt-1">
            Track your learning performance across all topics
          </p>
        </div>
        <div className="bg-[#FFD60A] border-3 border-black px-4 py-2 shadow-[4px_4px_0px_black] inline-flex items-center gap-2">
          <Zap className="w-4 h-4 text-black" />
          <span className="font-black text-black text-sm uppercase">Last Updated: Today</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Overall Score", value: "67%", delta: "+5%", up: true,  icon: Award,     color: "#0A84FF" },
          { label: "Topics Done",   value: "3/8",  delta: "37%", up: true,  icon: Target,    color: "#34C759" },
          { label: "Quiz Accuracy", value: "74%",  delta: "+12%",up: true,  icon: TrendingUp,color: "#FFD60A" },
          { label: "Weak Topics",   value: "3",    delta: "-1",  up: true,  icon: TrendingDown,color:"#FF3B30" },
        ].map(({ label, value, delta, up, icon: Icon, color }) => (
          <div
            key={label}
            style={{ boxShadow: "5px 5px 0px black" }}
            className="bg-white border-4 border-black p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className="w-9 h-9 border-3 border-black flex items-center justify-center"
                style={{ backgroundColor: color }}
              >
                <Icon className="w-4 h-4 text-black" />
              </div>
              <div
                className="flex items-center gap-1 text-xs font-black px-2 py-0.5 border-2 border-black"
                style={{ backgroundColor: up ? "#34C759" : "#FF3B30", color: up ? "#000" : "#fff" }}
              >
                {up ? "▲" : "▼"} {delta}
              </div>
            </div>
            <div className="font-black text-2xl text-black leading-none mb-1">{value}</div>
            <div className="font-bold text-xs text-black/60 uppercase tracking-wide">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-0 border-3 border-black w-fit">
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 font-black text-xs uppercase tracking-wide border-r-3 last:border-r-0 border-black transition-all
              ${activeTab === id ? "bg-black text-white" : "bg-white text-black hover:bg-[#FFD60A]"}`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Charts */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Progress */}
          <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_black]">
            <h2 className="font-black text-black text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Monthly Progress
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray="0" stroke="#E0E0E0" />
                <XAxis
                  dataKey="week"
                  tick={{ fontFamily: "Space Grotesk", fontWeight: 900, fontSize: 11 }}
                  axisLine={{ stroke: "#000", strokeWidth: 3 }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontFamily: "Space Grotesk", fontWeight: 900, fontSize: 11 }}
                  axisLine={{ stroke: "#000", strokeWidth: 3 }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="overall"
                  name="overall"
                  stroke="#0A84FF"
                  strokeWidth={4}
                  dot={{ fill: "#0A84FF", stroke: "#000", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: "#000", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Topic Scores Bar */}
          <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_black]">
            <h2 className="font-black text-black text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Score by Topic
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topicScores} barSize={20}>
                <CartesianGrid strokeDasharray="0" stroke="#E0E0E0" horizontal vertical={false} />
                <XAxis
                  dataKey="topic"
                  tick={{ fontFamily: "Space Grotesk", fontWeight: 900, fontSize: 9 }}
                  axisLine={{ stroke: "#000", strokeWidth: 3 }}
                  tickLine={false}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontFamily: "Space Grotesk", fontWeight: 900, fontSize: 11 }}
                  axisLine={{ stroke: "#000", strokeWidth: 3 }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" name="score" stroke="#000" strokeWidth={2} radius={[0,0,0,0]}>
                  {topicScores.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Strengths vs Weaknesses */}
          <div className="lg:col-span-2 bg-white border-4 border-black p-5 shadow-[6px_6px_0px_black]">
            <h2 className="font-black text-black text-sm uppercase tracking-wide mb-4">
              🎯 Performance Breakdown
            </h2>
            <div className="space-y-3">
              {topicScores.map(({ topic, score, fill, attempts }) => (
                <div key={topic} className="flex items-center gap-4">
                  <div className="w-28 font-black text-black text-xs uppercase text-right flex-shrink-0">
                    {topic}
                  </div>
                  <div className="flex-1 h-8 bg-[#F0F0F0] border-3 border-black relative overflow-hidden">
                    <div
                      className="h-full border-r-3 border-black transition-all duration-700"
                      style={{ width: `${score}%`, backgroundColor: fill }}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-black mix-blend-multiply">
                      {score}%
                    </span>
                  </div>
                  <div className="w-20 flex-shrink-0">
                    <div
                      className="text-xs font-black px-2 py-1 border-2 border-black text-center"
                      style={{
                        backgroundColor: fill,
                        color: fill === "#FFD60A" || fill === "#34C759" || fill === "#E0E0E0" ? "#000" : "#fff",
                      }}
                    >
                      {attempts} tries
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "topics" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topicScores.map(({ topic, score, fill, attempts }) => {
            const status = score >= 70 ? "Strong" : score >= 40 ? "Weak" : score > 0 ? "Critical" : "Not Started";
            const statusBg = score >= 70 ? "#34C759" : score >= 40 ? "#FFD60A" : score > 0 ? "#FF3B30" : "#E0E0E0";
            return (
              <div
                key={topic}
                style={{ boxShadow: "6px 6px 0px black" }}
                className="bg-white border-4 border-black p-4"
              >
                <div
                  className="w-full h-2 border-2 border-black mb-4"
                  style={{ backgroundColor: "#F0F0F0" }}
                >
                  <div
                    className="h-full"
                    style={{ width: `${score}%`, backgroundColor: fill }}
                  />
                </div>
                <h3 className="font-black text-black text-sm uppercase tracking-wide mb-2">
                  {topic}
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-black text-2xl text-black">{score}%</span>
                  <div
                    className="px-2 py-0.5 border-2 border-black font-black text-xs uppercase"
                    style={{
                      backgroundColor: statusBg,
                      color: statusBg === "#FFD60A" || statusBg === "#34C759" || statusBg === "#E0E0E0" ? "#000" : "#fff",
                    }}
                  >
                    {status}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-black/50">
                  <Clock className="w-3 h-3" /> {attempts} quiz attempts
                </div>
                {/* Mini bar */}
                <div className="mt-3 h-5 bg-[#F0F0F0] border-2 border-black relative overflow-hidden">
                  <div
                    className="h-full"
                    style={{ width: `${score}%`, backgroundColor: fill }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "weekly" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily score */}
          <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_black]">
            <h2 className="font-black text-black text-sm uppercase tracking-wide mb-4">
              📊 Daily Quiz Score
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyData} barSize={28}>
                <CartesianGrid strokeDasharray="0" stroke="#E0E0E0" horizontal vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontFamily: "Space Grotesk", fontWeight: 900, fontSize: 11 }}
                  axisLine={{ stroke: "#000", strokeWidth: 3 }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontFamily: "Space Grotesk", fontWeight: 900, fontSize: 11 }}
                  axisLine={{ stroke: "#000", strokeWidth: 3 }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" name="score" fill="#0A84FF" stroke="#000" strokeWidth={2}>
                  {weeklyData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.score >= 80 ? "#34C759" : entry.score >= 65 ? "#0A84FF" : "#FF3B30"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Study time */}
          <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_black]">
            <h2 className="font-black text-black text-sm uppercase tracking-wide mb-4">
              ⏱ Study Time (minutes)
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyData} barSize={28}>
                <CartesianGrid strokeDasharray="0" stroke="#E0E0E0" horizontal vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontFamily: "Space Grotesk", fontWeight: 900, fontSize: 11 }}
                  axisLine={{ stroke: "#000", strokeWidth: 3 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontFamily: "Space Grotesk", fontWeight: 900, fontSize: 11 }}
                  axisLine={{ stroke: "#000", strokeWidth: 3 }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="time" name="time" fill="#FFD60A" stroke="#000" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly summary */}
          <div className="lg:col-span-2 bg-black border-4 border-black p-5 shadow-[6px_6px_0px_#FFD60A]">
            <h2 className="font-black text-[#FFD60A] text-sm uppercase tracking-wide mb-4">
              📋 Weekly Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Questions",  value: weeklyData.reduce((a, d) => a + d.questions, 0).toString(), color: "#0A84FF" },
                { label: "Avg Score",        value: `${Math.round(weeklyData.reduce((a, d) => a + d.score, 0) / weeklyData.length)}%`, color: "#34C759" },
                { label: "Total Study Time", value: `${weeklyData.reduce((a, d) => a + d.time, 0)}min`, color: "#FFD60A" },
                { label: "Best Day",         value: "Sunday", color: "#FF3B30" },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  style={{ backgroundColor: color, boxShadow: "4px 4px 0px white" }}
                  className="border-3 border-white p-3"
                >
                  <div className="font-black text-xl text-black leading-tight">{value}</div>
                  <div className="font-bold text-xs text-black/70 uppercase mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "radar" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_black]">
            <h2 className="font-black text-black text-sm uppercase tracking-wide mb-4">
              🕸 Skills Radar
            </h2>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#000" strokeWidth={1} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontFamily: "Space Grotesk", fontWeight: 900, fontSize: 10 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 9 }}
                />
                <Radar
                  name="score"
                  dataKey="score"
                  stroke="#000"
                  strokeWidth={3}
                  fill="#FFD60A"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_black]">
              <h2 className="font-black text-black text-sm uppercase tracking-wide mb-4">
                🏆 Rankings
              </h2>
              <div className="space-y-2">
                {[...topicScores]
                  .sort((a, b) => b.score - a.score)
                  .map(({ topic, score, fill }, rank) => (
                    <div
                      key={topic}
                      className="flex items-center gap-3 border-3 border-black p-2"
                    >
                      <div
                        className="w-7 h-7 border-2 border-black flex items-center justify-center font-black text-sm flex-shrink-0"
                        style={{ backgroundColor: rank === 0 ? "#FFD60A" : rank === 1 ? "#E0E0E0" : rank === 2 ? "#FFD60A" : "#F0F0F0" }}
                      >
                        {rank + 1}
                      </div>
                      <span className="flex-1 font-black text-black text-xs uppercase">{topic}</span>
                      <div
                        className="px-3 py-1 border-2 border-black font-black text-xs"
                        style={{
                          backgroundColor: fill,
                          color: fill === "#FFD60A" || fill === "#34C759" || fill === "#E0E0E0" ? "#000" : "#fff",
                        }}
                      >
                        {score}%
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
