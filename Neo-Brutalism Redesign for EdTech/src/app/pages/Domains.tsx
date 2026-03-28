import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowRight,
  X,
  CheckCircle2,
  Lock,
  Zap,
  BookOpen,
  ChevronRight,
  Globe,
  Brain,
  Smartphone,
  Database,
  Shield,
  Cpu,
  Code2,
  BarChart2,
} from "lucide-react";

/* ─── Domain Data ─────────────────────────────────────────────── */
const domains = [
  {
    id: "dsa",
    emoji: "💻",
    label: "DSA",
    sublabel: "CP Style",
    color: "#FFD60A",
    textColor: "#000",
    shadow: "#ccaa00",
    icon: Code2,
    tag: "CORE",
    difficulty: "Hard",
    topics: [
      "Arrays & Strings",
      "Linked Lists",
      "Stacks & Queues",
      "Trees & Graphs",
      "Dynamic Programming",
      "Greedy Algorithms",
      "Sorting & Searching",
      "Bit Manipulation",
    ],
    desc: "Master data structures and algorithms in competitive-programming style — timed problem sets, editorial hints, and contest simulation.",
  },
  {
    id: "webdev",
    emoji: "🌐",
    label: "Web Dev",
    sublabel: "Full Stack",
    color: "#0A84FF",
    textColor: "#fff",
    shadow: "#0060CC",
    icon: Globe,
    tag: "POPULAR",
    difficulty: "Medium",
    topics: [
      "HTML & CSS Fundamentals",
      "JavaScript & ES6+",
      "React & Next.js",
      "Node.js & Express",
      "REST APIs & GraphQL",
      "Databases (SQL / NoSQL)",
      "Authentication & Security",
      "Deployment & DevOps",
    ],
    desc: "Go from HTML basics to full-stack deployment — build real projects with React, Node.js, databases, and cloud hosting.",
  },
  {
    id: "aptitude",
    emoji: "🧠",
    label: "Aptitude",
    sublabel: "Placement Prep",
    color: "#34C759",
    textColor: "#000",
    shadow: "#229A43",
    icon: Brain,
    tag: "PLACEMENT",
    difficulty: "Medium",
    topics: [
      "Quantitative Aptitude",
      "Logical Reasoning",
      "Verbal Ability",
      "Data Interpretation",
      "Number Systems",
      "Probability & Statistics",
      "Time & Work",
      "Puzzles & Riddles",
    ],
    desc: "Crack aptitude rounds for top product companies — timed tests, weak area detection, and personalized drill sheets.",
  },
  {
    id: "appdev",
    emoji: "📱",
    label: "App Dev",
    sublabel: "Mobile",
    color: "#FF3B30",
    textColor: "#fff",
    shadow: "#cc2e25",
    icon: Smartphone,
    tag: "OPTIONAL",
    difficulty: "Medium",
    topics: [
      "React Native Basics",
      "Navigation & Routing",
      "State Management",
      "Native APIs",
      "UI Components",
      "Firebase Integration",
      "App Store Deployment",
      "Performance Optimization",
    ],
    desc: "Build cross-platform mobile apps with React Native — from setup to Play Store & App Store deployment.",
  },
  {
    id: "datascience",
    emoji: "📊",
    label: "Data Science",
    sublabel: "ML / AI",
    color: "#AF52DE",
    textColor: "#fff",
    shadow: "#8e3db3",
    icon: BarChart2,
    tag: "TRENDING",
    difficulty: "Hard",
    topics: [
      "Python for Data Science",
      "NumPy & Pandas",
      "Data Visualization",
      "Machine Learning (sklearn)",
      "Deep Learning (PyTorch)",
      "NLP Basics",
      "Model Deployment",
      "Kaggle Practice",
    ],
    desc: "Learn data wrangling, ML models, and deep learning — with hands-on Kaggle datasets and real-world project walkthroughs.",
  },
  {
    id: "cybersecurity",
    emoji: "🔒",
    label: "Cybersecurity",
    sublabel: "Ethical Hacking",
    color: "#FF9F0A",
    textColor: "#000",
    shadow: "#cc7f00",
    icon: Shield,
    tag: "SPECIALIZED",
    difficulty: "Hard",
    topics: [
      "Networking Fundamentals",
      "Linux & Bash",
      "OWASP Top 10",
      "Web App Pentesting",
      "Network Scanning (Nmap)",
      "Metasploit Framework",
      "CTF Challenges",
      "Security Certifications",
    ],
    desc: "Go ethical hacker mode — understand attack vectors, defend systems, and practice CTF challenges on real-world scenarios.",
  },
  {
    id: "iot",
    emoji: "🔌",
    label: "IoT",
    sublabel: "Embedded Systems",
    color: "#5AC8FA",
    textColor: "#000",
    shadow: "#3da8d8",
    icon: Cpu,
    tag: "NICHE",
    difficulty: "Medium",
    topics: [
      "Arduino & Raspberry Pi",
      "Sensors & Actuators",
      "MQTT & HTTP Protocols",
      "Edge Computing",
      "Cloud IoT Platforms",
      "Microcontroller Programming",
      "Real-time Data Streaming",
      "IoT Security",
    ],
    desc: "Build smart devices from scratch — program microcontrollers, connect sensors to the cloud, and visualize real-time data.",
  },
  {
    id: "python",
    emoji: "🐍",
    label: "Python",
    sublabel: "Core → Advanced",
    color: "#000000",
    textColor: "#FFD60A",
    shadow: "#333",
    icon: Database,
    tag: "BEGINNER",
    difficulty: "Easy",
    topics: [
      "Python Basics & Syntax",
      "OOP in Python",
      "File I/O & Modules",
      "Decorators & Generators",
      "Regular Expressions",
      "Web Scraping",
      "Automation Scripts",
      "Testing & Debugging",
    ],
    desc: "Python from absolute zero to advanced — scripting, OOP, automation, and building real tools that solve actual problems.",
  },
];

const difficultyColor: Record<string, string> = {
  Easy: "#34C759",
  Medium: "#FFD60A",
  Hard: "#FF3B30",
};

/* ─── Domain Detail Panel ─────────────────────────────────────── */
function DomainDetail({
  domain,
  onClose,
  onStart,
}: {
  domain: (typeof domains)[0];
  onClose: () => void;
  onStart: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg border-4 border-black overflow-hidden"
        style={{
          background: "#f5f0e8",
          boxShadow: "10px 10px 0px #000",
          backgroundImage:
            "radial-gradient(circle, #00000012 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-6 border-b-4 border-black flex items-start justify-between"
          style={{ backgroundColor: domain.color }}
        >
          <div>
            <div
              className="text-xs font-black uppercase tracking-widest mb-1 opacity-70"
              style={{ color: domain.textColor }}
            >
              {domain.tag} · {domain.difficulty} difficulty
            </div>
            <div
              className="text-4xl font-black uppercase leading-none tracking-tighter"
              style={{ color: domain.textColor }}
            >
              {domain.emoji} {domain.label}
            </div>
            <div
              className="font-bold text-sm mt-1 opacity-75"
              style={{ color: domain.textColor }}
            >
              {domain.sublabel}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-black flex items-center justify-center border-2 border-black hover:bg-white transition-colors flex-shrink-0 mt-1"
          >
            <X className="w-5 h-5 text-white hover:text-black" />
          </button>
        </div>

        {/* Description */}
        <div className="px-6 pt-5 pb-3 border-b-4 border-black bg-white/60">
          <p className="text-black font-bold text-sm leading-relaxed">
            {domain.desc}
          </p>
        </div>

        {/* Topics */}
        <div className="p-6">
          <div className="text-xs font-black uppercase tracking-widest text-black mb-3 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" /> Topics Covered
          </div>
          <div className="grid grid-cols-2 gap-2">
            {domain.topics.map((t, i) => (
              <div
                key={t}
                className="flex items-center gap-2 border-2 border-black px-3 py-2 bg-white text-black"
                style={{
                  boxShadow: "2px 2px 0px #000",
                }}
              >
                {i < 3 ? (
                  <CheckCircle2
                    className="w-3.5 h-3.5 flex-shrink-0"
                    style={{ color: domain.color === "#000000" ? "#FFD60A" : domain.color }}
                  />
                ) : (
                  <Lock className="w-3.5 h-3.5 flex-shrink-0 text-black/30" />
                )}
                <span className="text-xs font-bold leading-tight">{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onStart}
            className="flex-1 flex items-center justify-center gap-2 py-4 border-4 border-black font-black text-sm uppercase tracking-widest transition-all duration-150 hover:translate-x-[3px] hover:translate-y-[3px]"
            style={{
              backgroundColor: domain.color,
              color: domain.textColor,
              boxShadow: "6px 6px 0px #000",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.boxShadow = "3px 3px 0px #000")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.boxShadow = "6px 6px 0px #000")
            }
          >
            <Zap className="w-5 h-5" />
            Start Learning
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Domains Page ────────────────────────────────────────────── */
export function Domains() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<(typeof domains)[0] | null>(null);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div
        className="border-4 border-black p-6 md:p-8 relative overflow-hidden"
        style={{
          background: "#000",
          boxShadow: "8px 8px 0px #FFD60A",
        }}
      >
        <div className="absolute top-0 right-0 text-[160px] font-black opacity-5 leading-none select-none text-white -mt-4 -mr-4">
          ∞
        </div>
        <div className="relative z-10">
          <div className="text-[#FFD60A] font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
            <ChevronRight className="w-4 h-4" /> Choose Your Domain
          </div>
          <h1 className="text-white font-black text-3xl md:text-5xl uppercase leading-tight tracking-tighter mb-3">
            What do you want
            <br />
            <span className="text-[#FFD60A]">to master?</span>
          </h1>
          <p className="text-white/70 font-bold text-sm max-w-lg">
            Pick a domain. We'll trace your weak spots, map your concepts, and
            build a personalized path to get you job-ready.
          </p>
        </div>
      </div>

      {/* Domain Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {domains.map((d) => {
          const Icon = d.icon;
          return (
            <button
              key={d.id}
              onClick={() => setSelected(d)}
              className="text-left border-4 border-black p-5 flex flex-col gap-3 transition-all duration-150 group cursor-pointer"
              style={{
                backgroundColor: d.color,
                boxShadow: `6px 6px 0px ${d.shadow}`,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = `3px 3px 0px ${d.shadow}`;
                e.currentTarget.style.transform = "translate(3px, 3px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = `6px 6px 0px ${d.shadow}`;
                e.currentTarget.style.transform = "translate(0, 0)";
              }}
            >
              {/* Tag */}
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-black uppercase tracking-widest px-2 py-0.5 border-2 border-current"
                  style={{ color: d.textColor, borderColor: d.textColor }}
                >
                  {d.tag}
                </span>
                <span
                  className="text-xs font-bold px-2 py-0.5 border-2"
                  style={{
                    color: d.textColor,
                    borderColor: d.textColor,
                    backgroundColor:
                      d.id === "python" ? "#FFD60A20" : "rgba(0,0,0,0.1)",
                  }}
                >
                  {d.difficulty}
                </span>
              </div>

              {/* Icon + Emoji */}
              <div className="text-4xl leading-none">{d.emoji}</div>

              {/* Label */}
              <div>
                <div
                  className="font-black text-xl uppercase leading-tight tracking-tight"
                  style={{ color: d.textColor }}
                >
                  {d.label}
                </div>
                <div
                  className="font-bold text-xs opacity-70 mt-0.5"
                  style={{ color: d.textColor }}
                >
                  {d.sublabel}
                </div>
              </div>

              {/* Topics count */}
              <div
                className="mt-auto flex items-center justify-between text-xs font-black uppercase tracking-wide"
                style={{ color: d.textColor }}
              >
                <span>{d.topics.length} Topics</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>

      {/* How it works strip */}
      <div className="border-4 border-black p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 bg-white" style={{ boxShadow: '4px 4px 0px #000' }}>
        {[
          { n: "01", t: "Pick Domain", d: "Choose what you want to learn" },
          { n: "02", t: "Take Diagnostic", d: "We identify your weak areas" },
          { n: "03", t: "Get Your Path", d: "Personalized topic sequence" },
          { n: "04", t: "Practice & Improve", d: "Quizzes, drills, and concepts" },
        ].map(({ n, t, d }, i, arr) => (
          <div key={n} className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 border-3 border-black bg-[#FFD60A] flex items-center justify-center font-black text-sm flex-shrink-0">{n}</div>
              <div>
                <div className="font-black text-xs uppercase tracking-wide">{t}</div>
                <div className="text-black/50 text-xs font-bold">{d}</div>
              </div>
            </div>
            {i < arr.length - 1 && (
              <ChevronRight className="w-5 h-5 text-black/30 flex-shrink-0 hidden sm:block" strokeWidth={3} />
            )}
          </div>
        ))}
      </div>

      {/* Domain Detail Modal */}
      {selected && (
        <DomainDetail
          domain={selected}
          onClose={() => setSelected(null)}
          onStart={() => {
            setSelected(null);
            navigate("/practice");
          }}
        />
      )}
    </div>
  );
}
