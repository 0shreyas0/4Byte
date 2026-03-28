"use client";

import { useState } from "react";
import { Code2, Calculator, Cpu, ChevronRight, Zap } from "lucide-react";

interface DomainSelectionProps {
  onSelect: (domain: string) => void;
  onBack: () => void;
}

const DOMAINS = [
  {
    id: "DSA",
    name: "DSA",
    fullName: "Data Structures & Algorithms",
    icon: Cpu,
    emoji: "💻",
    color: "#FF3B3B",
    textColor: "#fff",
    shadow: "#cc2e25",
    bg: "#FFF0F0",
    description: "Arrays, loops, sorting, searching, trees, recursion and more.",
    topics: ["Loops", "Arrays", "Sorting", "Searching", "Recursion"],
    tag: "MOST POPULAR",
    difficulty: "Hard",
    insight: "Learn how concepts connect, not just how to solve problems",
    level: "Beginner → Advanced",
    questions: 8,
  },
  {
    id: "Web Dev",
    name: "Web Dev",
    fullName: "Web Development",
    icon: Code2,
    emoji: "🌐",
    color: "#3B82F6",
    textColor: "#fff",
    shadow: "#2563EB",
    bg: "#EFF6FF",
    description: "HTML, CSS, JavaScript, DOM, React and modern web tooling.",
    topics: ["HTML", "CSS", "JavaScript", "DOM", "React"],
    tag: "TRENDING",
    difficulty: "Medium",
    insight: "Understand how frontend layers depend on each other",
    level: "Beginner → Intermediate",
    questions: 8,
  },
  {
    id: "Aptitude",
    name: "Aptitude",
    fullName: "Quantitative Aptitude",
    icon: Calculator,
    emoji: "🧠",
    color: "#1DB954",
    textColor: "#000",
    shadow: "#17a348",
    bg: "#F0FDF4",
    description: "Percentages, ratios, algebra, geometry, time & work.",
    topics: ["Arithmetic", "Percentages", "Ratios", "Algebra", "Probability"],
    tag: "EXAM READY",
    difficulty: "Medium",
    insight: "Map your math fundamentals to crack any aptitude test",
    level: "Basic → Expert",
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

      {/* ── Hero header — black with yellow shadow ─────────────────────── */}
      <div
        style={{
          background: "#0D0D0D",
          border: "none",
          borderBottom: "4px solid #0D0D0D",
          padding: "24px 32px 28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative watermark */}
        <div style={{
          position: "absolute", top: 0, right: 0,
          fontSize: "140px", fontWeight: 900, opacity: 0.04,
          lineHeight: 1, color: "#fff", userSelect: "none",
          pointerEvents: "none",
        }}>∞</div>

        <div style={{ position: "relative", zIndex: 10 }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#FFD60A", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <ChevronRight size={14} /> Choose Your Domain
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, color: "#FFFFFF", marginBottom: 12 }}>
            What do you want
            <br />
            <span style={{ color: "#FFD60A" }}>to master?</span>
          </h1>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.65)", fontWeight: 600, maxWidth: 480, lineHeight: 1.6 }}>
            Pick a domain — we&apos;ll trace your weak spots, map your concepts,
            and build a personalized path to get you job-ready.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Domain grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {DOMAINS.map((domain) => {
            const Icon = domain.icon;
            const isSelected = selected === domain.id;
            return (
              <button
                key={domain.id}
                onClick={() => setSelected(domain.id)}
                className="text-left flex flex-col gap-3 p-5"
                style={{
                  border: `4px solid #0D0D0D`,
                  background: isSelected ? domain.color : "#FFFFFF",
                  boxShadow: isSelected
                    ? `3px 3px 0px ${domain.shadow}`
                    : `6px 6px 0px ${domain.shadow}`,
                  transform: isSelected ? "translate(3px, 3px)" : "translate(0,0)",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
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
                {/* Tag + difficulty */}
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.08em",
                      textTransform: "uppercase", padding: "2px 8px",
                      border: `2px solid ${isSelected ? domain.textColor : "#0D0D0D"}`,
                      color: isSelected ? domain.textColor : "#0D0D0D",
                    }}
                  >
                    {domain.tag}
                  </span>
                  <span
                    style={{
                      fontSize: "0.62rem", fontWeight: 700, padding: "2px 8px",
                      border: `2px solid ${isSelected ? domain.textColor : "#0D0D0D"}`,
                      color: isSelected ? domain.textColor : "#0D0D0D",
                      background: "rgba(0,0,0,0.08)",
                    }}
                  >
                    {domain.difficulty}
                  </span>
                </div>

                {/* Emoji + icon */}
                <div style={{ fontSize: "2.5rem", lineHeight: 1 }}>{domain.emoji}</div>

                {/* Name */}
                <div>
                  <div style={{
                    fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1,
                    color: isSelected ? domain.textColor : "#0D0D0D",
                  }}>
                    {domain.name}
                  </div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 600, opacity: 0.7, marginTop: 2, color: isSelected ? domain.textColor : "#444" }}>
                    {domain.fullName}
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: "0.85rem", lineHeight: 1.55, fontWeight: 500, color: isSelected ? domain.textColor : "#555" }}>
                  {domain.description}
                </p>

                {/* Topic chips */}
                <div className="flex flex-wrap gap-1.5">
                  {domain.topics.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: "0.68rem", fontWeight: 700,
                        padding: "2px 7px",
                        border: `2px solid ${isSelected ? domain.textColor : "#0D0D0D"}`,
                        background: isSelected ? "rgba(255,255,255,0.15)" : "#F5F0E8",
                        color: isSelected ? domain.textColor : "#0D0D0D",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto">
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: isSelected ? domain.textColor : "#888" }}>
                    {domain.questions} questions · {domain.level}
                  </span>
                  {isSelected && (
                    <div style={{
                      background: domain.textColor === "#fff" ? "#fff" : "#0D0D0D",
                      color: isSelected ? domain.color : "#fff",
                      border: "2px solid currentColor",
                      width: 28, height: 28,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: "1rem",
                    }}>
                      ✓
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Confirm button ─────────────────────────────────────────────── */}
        <div className="flex justify-end">
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
              : "Select a domain first"}
            {!confirming && selected && <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
