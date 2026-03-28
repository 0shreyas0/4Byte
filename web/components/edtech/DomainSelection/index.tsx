"use client";

import { useState } from "react";
import {
  Code2,
  Globe,
  Brain,
  Smartphone,
  BarChart3,
  Shield,
  Cpu,
  Database,
  ChevronRight,
  Zap,
} from "lucide-react";

interface DomainSelectionProps {
  onSelect: (domain: string) => void;
  onBack: () => void;
}

const DOMAINS = [
  {
    id: "DSA",
    name: "DSA",
    fullName: "Competitive Programming Style",
    icon: Code2,
    emoji: "💻",
    color: "#FFD60A",
    textColor: "#0D0D0D",
    shadow: "#ccaa00",
    description: "Arrays, recursion, trees, graphs, dynamic programming, and interview-heavy problem solving.",
    topics: ["Arrays", "Loops", "Recursion", "Sorting", "Trees"],
    tag: "CORE",
    difficulty: "Hard",
    level: "Beginner → Advanced",
    questions: 8,
  },
  {
    id: "Web Dev",
    name: "Web Dev",
    fullName: "Full Stack Development",
    icon: Globe,
    emoji: "🌐",
    color: "#0A84FF",
    textColor: "#FFFFFF",
    shadow: "#0060CC",
    description: "HTML, CSS, JavaScript, React, APIs, databases, and deployment workflows.",
    topics: ["HTML", "CSS", "JavaScript", "React", "APIs"],
    tag: "POPULAR",
    difficulty: "Medium",
    level: "Beginner → Intermediate",
    questions: 8,
  },
  {
    id: "Aptitude",
    name: "Aptitude",
    fullName: "Placement Prep",
    icon: Brain,
    emoji: "🧠",
    color: "#34C759",
    textColor: "#0D0D0D",
    shadow: "#229A43",
    description: "Quant, reasoning, verbal, DI, and placement-round fundamentals.",
    topics: ["Arithmetic", "Ratios", "Algebra", "Probability", "Puzzles"],
    tag: "PLACEMENT",
    difficulty: "Medium",
    level: "Basic → Expert",
    questions: 8,
  },
  {
    id: "App Dev",
    name: "App Dev",
    fullName: "Mobile Development",
    icon: Smartphone,
    emoji: "📱",
    color: "#FF3B30",
    textColor: "#FFFFFF",
    shadow: "#cc2e25",
    description: "React Native, navigation, native APIs, Firebase, and shipping mobile apps.",
    topics: ["React Native", "Routing", "State", "Native APIs", "Firebase"],
    tag: "MOBILE",
    difficulty: "Medium",
    level: "Intermediate",
    questions: 8,
  },
  {
    id: "Data Science",
    name: "Data Science",
    fullName: "ML / AI Track",
    icon: BarChart3,
    emoji: "📊",
    color: "#AF52DE",
    textColor: "#FFFFFF",
    shadow: "#8e3db3",
    description: "Python data workflows, visualization, ML, deep learning, and model deployment.",
    topics: ["Python", "Pandas", "Viz", "ML", "Deployment"],
    tag: "TRENDING",
    difficulty: "Hard",
    level: "Intermediate → Advanced",
    questions: 8,
  },
  {
    id: "Cybersecurity",
    name: "Cybersecurity",
    fullName: "Ethical Hacking",
    icon: Shield,
    emoji: "🔒",
    color: "#FF9F0A",
    textColor: "#0D0D0D",
    shadow: "#cc7f00",
    description: "Networking, Linux, OWASP, scanning, pentesting, and security tooling.",
    topics: ["Networking", "Linux", "OWASP", "Nmap", "CTF"],
    tag: "SPECIALIZED",
    difficulty: "Hard",
    level: "Intermediate → Advanced",
    questions: 8,
  },
  {
    id: "IoT",
    name: "IoT",
    fullName: "Embedded Systems",
    icon: Cpu,
    emoji: "🔌",
    color: "#5AC8FA",
    textColor: "#0D0D0D",
    shadow: "#3da8d8",
    description: "Microcontrollers, sensors, protocols, edge workflows, and cloud-connected hardware.",
    topics: ["Arduino", "Sensors", "MQTT", "Edge", "Security"],
    tag: "NICHE",
    difficulty: "Medium",
    level: "Intermediate",
    questions: 8,
  },
  {
    id: "Python",
    name: "Python",
    fullName: "Core to Advanced Python",
    icon: Database,
    emoji: "🐍",
    color: "#0D0D0D",
    textColor: "#FFD60A",
    shadow: "#333333",
    description: "Syntax, OOP, modules, automation, debugging, and practical scripting foundations.",
    topics: ["Syntax", "Functions", "OOP", "Modules", "Testing"],
    tag: "BEGINNER",
    difficulty: "Easy",
    level: "Beginner → Advanced",
    questions: 8,
  },
];

export default function DomainSelection({ onSelect, onBack }: DomainSelectionProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = () => {
    if (!selected) return;
    setConfirming(true);
    setTimeout(() => onSelect(selected), 400);
  };

  const selectedDomain = DOMAINS.find((d) => d.id === selected);

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8" }}>
      <div
        style={{
          background: "#0D0D0D",
          borderBottom: "4px solid #0D0D0D",
          padding: "24px 32px 28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            fontSize: "140px",
            fontWeight: 900,
            opacity: 0.04,
            lineHeight: 1,
            color: "#fff",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          ∞
        </div>

        <div style={{ position: "relative", zIndex: 10 }}>
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 800,
              color: "#FFD60A",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <ChevronRight size={14} /> Choose Your Domain
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: "#FFFFFF",
              marginBottom: 12,
            }}
          >
            What do you want
            <br />
            <span style={{ color: "#FFD60A" }}>to master?</span>
          </h1>
          <p
            style={{
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.65)",
              fontWeight: 600,
              maxWidth: 560,
              lineHeight: 1.6,
            }}
          >
            Pick a domain and we&apos;ll trace weak spots, map concept dependencies,
            and generate a personalized recovery path.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {DOMAINS.map((domain) => {
            const Icon = domain.icon;
            const isSelected = selected === domain.id;
            return (
              <button
                key={domain.id}
                onClick={() => setSelected(domain.id)}
                className="text-left flex flex-col gap-3 p-5"
                style={{
                  border: "4px solid #0D0D0D",
                  background: isSelected ? domain.color : "#FFFFFF",
                  boxShadow: isSelected
                    ? `3px 3px 0px ${domain.shadow}`
                    : `6px 6px 0px ${domain.shadow}`,
                  transform: isSelected ? "translate(3px, 3px)" : "translate(0,0)",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  minHeight: 280,
                }}
                onMouseEnter={(e) => {
                  if (isSelected) return;
                  e.currentTarget.style.boxShadow = `3px 3px 0px ${domain.shadow}`;
                  e.currentTarget.style.transform = "translate(3px, 3px)";
                }}
                onMouseLeave={(e) => {
                  if (isSelected) return;
                  e.currentTarget.style.boxShadow = `6px 6px 0px ${domain.shadow}`;
                  e.currentTarget.style.transform = "translate(0, 0)";
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontSize: "0.62rem",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "2px 8px",
                      border: `2px solid ${isSelected ? domain.textColor : "#0D0D0D"}`,
                      color: isSelected ? domain.textColor : "#0D0D0D",
                    }}
                  >
                    {domain.tag}
                  </span>
                  <span
                    style={{
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      border: `2px solid ${isSelected ? domain.textColor : "#0D0D0D"}`,
                      color: isSelected ? domain.textColor : "#0D0D0D",
                      background: "rgba(0,0,0,0.08)",
                    }}
                  >
                    {domain.difficulty}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div style={{ fontSize: "2.5rem", lineHeight: 1 }}>{domain.emoji}</div>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `3px solid ${isSelected ? domain.textColor : "#0D0D0D"}`,
                      color: isSelected ? domain.textColor : "#0D0D0D",
                    }}
                  >
                    <Icon size={18} />
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                      lineHeight: 1.1,
                      color: isSelected ? domain.textColor : "#0D0D0D",
                    }}
                  >
                    {domain.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      opacity: 0.7,
                      marginTop: 2,
                      color: isSelected ? domain.textColor : "#444",
                    }}
                  >
                    {domain.fullName}
                  </div>
                </div>

                <p
                  style={{
                    fontSize: "0.85rem",
                    lineHeight: 1.55,
                    fontWeight: 500,
                    color: isSelected ? domain.textColor : "#555",
                  }}
                >
                  {domain.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {domain.topics.map((topic) => (
                    <span
                      key={topic}
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        padding: "2px 7px",
                        border: `2px solid ${isSelected ? domain.textColor : "#0D0D0D"}`,
                        background: isSelected ? "rgba(255,255,255,0.15)" : "#F5F0E8",
                        color: isSelected ? domain.textColor : "#0D0D0D",
                      }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: isSelected ? domain.textColor : "#888",
                    }}
                  >
                    {domain.questions} questions · {domain.level}
                  </span>
                  {isSelected && (
                    <div
                      style={{
                        background: domain.textColor === "#FFFFFF" ? "#FFFFFF" : "#0D0D0D",
                        color: isSelected ? domain.color : "#FFFFFF",
                        border: "2px solid currentColor",
                        width: 28,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "1rem",
                      }}
                    >
                      ✓
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="brutal-btn px-5 py-3 text-sm"
            style={{ background: "#FFFFFF" }}
          >
            ← Back
          </button>

          <button
            onClick={handleConfirm}
            disabled={!selected || confirming}
            className="brutal-btn flex items-center gap-3 px-8 py-4"
            style={{
              background: selected ? "#FFD60A" : "#E5E5E5",
              color: selected ? "#0D0D0D" : "#999",
              cursor: selected ? "pointer" : "not-allowed",
              opacity: confirming ? 0.7 : 1,
              fontSize: "0.95rem",
              fontWeight: 800,
              letterSpacing: "0.02em",
              boxShadow: selected ? `6px 6px 0 ${selectedDomain?.shadow ?? "#0D0D0D"}` : "4px 4px 0 #CCCCCC",
            }}
          >
            <Zap size={18} />
            {confirming
              ? "Loading..."
              : selected
                ? `Start ${selected} Quiz`
                : "Choose a Domain"}
          </button>
        </div>
      </div>
    </div>
  );
}
