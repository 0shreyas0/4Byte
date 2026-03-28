"use client";

import { useState } from "react";
import { Code2, Calculator, Cpu, ChevronRight } from "lucide-react";

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
    color: "#FF3B3B",
    bg: "#FFF0F0",
    description: "Arrays, loops, sorting, searching, trees, recursion and more.",
    topics: ["Loops", "Arrays", "Sorting", "Searching", "Recursion"],
    tag: "Most Popular",
    insight: "Learn how concepts connect, not just solve problems",
    level: "Beginner → Advanced",
    questions: 8,
  },
  {
    id: "Web Dev",
    name: "Web Dev",
    fullName: "Web Development",
    icon: Code2,
    color: "#3B82F6",
    bg: "#EFF6FF",
    description: "HTML, CSS, JavaScript, DOM, React and modern web tooling.",
    topics: ["HTML", "CSS", "JavaScript", "DOM", "React"],
    tag: "Trending",
    insight: "Understand how frontend layers depend on each other",
    level: "Beginner → Intermediate",
    questions: 8,
  },
  {
    id: "Aptitude",
    name: "Aptitude",
    fullName: "Quantitative Aptitude",
    icon: Calculator,
    color: "#1DB954",
    bg: "#F0FDF4",
    description: "Percentages, ratios, algebra, geometry, time & work.",
    topics: ["Arithmetic", "Percentages", "Ratios", "Algebra", "Probability"],
    tag: "Exam Ready",
    insight: "Map your math fundamentals to crack any aptitude test",
    level: "Basic → Expert",
    questions: 8,
  },
];

export default function DomainSelection({ onSelect, onBack }: DomainSelectionProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const handleSelect = (id: string) => {
    setSelected(id);
  };

  const handleConfirm = () => {
    if (!selected) return;
    setConfirming(true);
    setTimeout(() => {
      onSelect(selected);
    }, 400);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8" }}>
      {/* Header */}
      <div
        style={{
          borderBottom: "2.5px solid #0D0D0D",
          background: "#FFFFFF",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          onClick={onBack}
          className="brutal-btn px-4 py-2 text-sm"
          style={{ background: "#F5F0E8" }}
        >
          ← Back
        </button>
        <div style={{ width: "2px", height: "24px", background: "#0D0D0D" }} />
        <div>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Step 1 of 5
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Choose Your Domain
          </div>
        </div>
        {/* Progress bar */}
        <div className="flex-1 ml-4 hidden md:block">
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: "20%", background: "#FFD60A" }} />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: "12px" }}>
            What do you want to<br />
            <span style={{ background: "#FFD60A", padding: "0 6px" }}>master today?</span>
          </h1>
          <p style={{ fontSize: "1rem", color: "#555", fontWeight: 500, maxWidth: "500px", lineHeight: 1.6 }}>
            Select a domain to begin. We&apos;ll assess your knowledge, trace your gaps, and build your path.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {DOMAINS.map((domain) => {
            const Icon = domain.icon;
            const isSelected = selected === domain.id;
            return (
              <div
                key={domain.id}
                onClick={() => handleSelect(domain.id)}
                style={{
                  border: isSelected ? `3px solid ${domain.color}` : "2.5px solid #0D0D0D",
                  boxShadow: isSelected
                    ? `6px 6px 0 ${domain.color}`
                    : "4px 4px 0 #0D0D0D",
                  background: isSelected ? domain.bg : "#FFFFFF",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  transform: isSelected ? "translate(-2px, -2px)" : "none",
                  position: "relative",
                  overflow: "hidden",
                }}
                className="p-6"
              >
                {/* Tag */}
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    background: domain.color,
                    color: "#FFFFFF",
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    padding: "3px 8px",
                    letterSpacing: "0.05em",
                    border: "1.5px solid #0D0D0D",
                  }}
                >
                  {domain.tag}
                </div>

                {/* Icon */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    background: domain.color,
                    border: "2.5px solid #0D0D0D",
                    boxShadow: "3px 3px 0 #0D0D0D",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Icon size={24} color="#FFFFFF" strokeWidth={2.5} />
                </div>

                <h2 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>
                  {domain.name}
                </h2>
                <div style={{ fontSize: "0.8rem", color: "#666", fontWeight: 600, marginBottom: 12 }}>
                  {domain.fullName}
                </div>
                <p style={{ fontSize: "0.88rem", color: "#444", lineHeight: 1.6, marginBottom: 16, fontWeight: 500 }}>
                  {domain.description}
                </p>

                {/* Topics */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {domain.topics.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        border: "2px solid #0D0D0D",
                        padding: "2px 8px",
                        background: isSelected ? domain.color + "22" : "#F5F0E8",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Brilliant insight */}
                <div
                  style={{
                    background: isSelected ? domain.color + "15" : "#F5F0E8",
                    border: `1.5px solid ${isSelected ? domain.color : "#CCCCCC"}`,
                    padding: "10px 12px",
                    fontSize: "0.8rem",
                    fontStyle: "italic",
                    color: "#444",
                    fontWeight: 500,
                    lineHeight: 1.5,
                    marginBottom: 12,
                  }}
                >
                  &ldquo;{domain.insight}&rdquo;
                </div>

                <div className="flex items-center justify-between">
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#888" }}>
                    {domain.questions} questions · {domain.level}
                  </span>
                  {isSelected && (
                    <div
                      style={{
                        background: domain.color,
                        color: "#fff",
                        border: "2px solid #0D0D0D",
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
              </div>
            );
          })}
        </div>

        {/* Confirm button */}
        <div className="flex justify-end">
          <button
            onClick={handleConfirm}
            disabled={!selected || confirming}
            className="brutal-btn flex items-center gap-3 px-8 py-4 text-lg"
            style={{
              background: selected ? "#FFD60A" : "#E5E5E5",
              color: selected ? "#0D0D0D" : "#999",
              cursor: selected ? "pointer" : "not-allowed",
              opacity: confirming ? 0.7 : 1,
            }}
          >
            {confirming ? "Loading..." : selected ? `Start ${selected} Quiz` : "Select a domain"}
            {!confirming && selected && <ChevronRight size={22} />}
          </button>
        </div>
      </div>
    </div>
  );
}
