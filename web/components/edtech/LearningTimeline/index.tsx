"use client";

import { useState } from "react";
import { Lock, CheckCircle, Circle, ChevronRight, Info } from "lucide-react";

interface TimelineProps {
  domain: string;
  onStart: () => void;
  onBack: () => void;
}

type NodeStatus = "locked" | "active" | "completed";

interface TimelineNode {
  id: string;
  label: string;
  status: NodeStatus;
  why: string;
  connects: string[];
}

const TIMELINE_DATA: Record<string, TimelineNode[]> = {
  DSA: [
    { id: "variables", label: "Variables", status: "completed", why: "The atomic unit of all programs. Without this, nothing works.", connects: ["Loops", "Functions"] },
    { id: "loops", label: "Loops", status: "completed", why: "Powers all repetition logic — without this, you can't traverse data.", connects: ["Arrays", "Sorting", "Searching"] },
    { id: "functions", label: "Functions", status: "active", why: "Abstraction and reuse — the backbone of clean code.", connects: ["Recursion"] },
    { id: "arrays", label: "Arrays", status: "active", why: "The most fundamental data store. Mastery unlocks Sorting+Searching.", connects: ["Strings", "Sorting", "Searching"] },
    { id: "strings", label: "Strings", status: "locked", why: "Strings are just character arrays. Mastering Arrays unlocks this.", connects: [] },
    { id: "recursion", label: "Recursion", status: "locked", why: "Requires mastering Functions first. Unlocks Trees and Graph DFS.", connects: ["Trees"] },
    { id: "sorting", label: "Sorting", status: "locked", why: "You need Arrays + Loops before you can sort.", connects: [] },
    { id: "searching", label: "Searching", status: "locked", why: "Binary search requires sorted arrays. Linear search needs loops.", connects: [] },
    { id: "linked-lists", label: "Linked Lists", status: "locked", why: "Pointer logic — requires Functions mastery.", connects: ["Trees"] },
    { id: "trees", label: "Trees", status: "locked", why: "Needs Recursion + Linked Lists. The pinnacle of this path.", connects: [] },
  ],
  "Web Dev": [
    { id: "html", label: "HTML Basics", status: "completed", why: "The skeleton of every webpage. Everything visual is built on this.", connects: ["CSS", "DOM"] },
    { id: "css", label: "CSS Basics", status: "completed", why: "Style the skeleton. Without HTML, CSS does nothing.", connects: ["Flexbox", "Grid"] },
    { id: "flexbox", label: "Flexbox", status: "active", why: "The modern way to layout UI. Requires CSS fundamentals.", connects: [] },
    { id: "grid", label: "Grid", status: "active", why: "2D layouts. Requires CSS fundamentals. More powerful than Flexbox.", connects: [] },
    { id: "js", label: "JS Basics", status: "completed", why: "Logic, interactivity, and data manipulation.", connects: ["DOM", "Fetch"] },
    { id: "dom", label: "DOM", status: "active", why: "Connects JS to HTML. The bridge between logic and display.", connects: ["Events"] },
    { id: "events", label: "Events", status: "locked", why: "User interaction. Requires DOM understanding first.", connects: ["Fetch"] },
    { id: "fetch", label: "Fetch/API", status: "locked", why: "Talk to servers. Requires JS + Events mastery.", connects: ["React"] },
    { id: "react", label: "React Basics", status: "locked", why: "Component model. Requires JS + DOM fundamentals.", connects: ["State"] },
    { id: "state", label: "State Management", status: "locked", why: "Data flow in apps. Requires React mastery.", connects: [] },
  ],
  Aptitude: [
    { id: "arithmetic", label: "Arithmetic", status: "completed", why: "All math starts here. The root of the entire dependency graph.", connects: ["Percentages", "Ratios", "Algebra"] },
    { id: "percentages", label: "Percentages", status: "active", why: "A ratio application. Requires arithmetic fluency.", connects: ["Profit & Loss"] },
    { id: "ratios", label: "Ratios", status: "active", why: "Comparing quantities. Core of time-work and distance problems.", connects: ["Time & Work", "Time & Distance", "Probability"] },
    { id: "algebra", label: "Algebra", status: "active", why: "Equations and unknowns. Extends arithmetic into abstract thinking.", connects: [] },
    { id: "geometry", label: "Geometry", status: "locked", why: "Shapes and space. Needs arithmetic as foundation.", connects: [] },
    { id: "time-work", label: "Time & Work", status: "locked", why: "Requires Ratios mastery. Common in competitive exams.", connects: [] },
    { id: "time-distance", label: "Time & Distance", status: "locked", why: "Speed problems. Needs Ratio + Arithmetic.", connects: [] },
    { id: "profit-loss", label: "Profit & Loss", status: "locked", why: "Business math. Needs percentages to understand.", connects: [] },
    { id: "probability", label: "Probability", status: "locked", why: "Chances and outcomes. Needs Ratios to reason about.", connects: ["Permutation"] },
    { id: "permutation", label: "Permutation", status: "locked", why: "Arrangements and choices. The capstone.", connects: [] },
  ],
};

export default function LearningTimeline({ domain, onStart, onBack }: TimelineProps) {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const nodes = TIMELINE_DATA[domain] || TIMELINE_DATA["DSA"];

  const completed = nodes.filter((n) => n.status === "completed").length;
  const total = nodes.length;
  const progress = (completed / total) * 100;

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
        <button onClick={onBack} className="brutal-btn px-4 py-2 text-sm" style={{ background: "#F5F0E8" }}>
          ← Back
        </button>
        <div style={{ width: "2px", height: "24px", background: "#0D0D0D" }} />
        <div>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Step 2 of 5
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Your Learning Timeline · {domain}
          </div>
        </div>
        <div className="flex-1 ml-4 hidden md:block">
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: "40%", background: "#FFD60A" }} />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 8 }}>
              Concept Path — {domain}
            </h1>
            <p style={{ color: "#555", fontWeight: 500, fontSize: "0.95rem" }}>
              Topics unlock in order. Each concept depends on mastering its prerequisites.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Legend */}
            <div className="flex gap-3">
              {[
                { color: "#1DB954", label: "Done" },
                { color: "#FFD60A", label: "Active" },
                { color: "#CCCCCC", label: "Locked" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div style={{ width: 12, height: 12, background: l.color, border: "2px solid #0D0D0D" }} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div
          className="p-4 mb-8 flex items-center gap-4"
          style={{ border: "2.5px solid #0D0D0D", background: "#FFFFFF", boxShadow: "4px 4px 0 #0D0D0D" }}
        >
          <div style={{ fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.03em", minWidth: 60 }}>
            {completed}/{total}
          </div>
          <div className="flex-1">
            <div style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: 6 }}>Concepts Mastered</div>
            <div className="progress-bar-bg" style={{ height: 16 }}>
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%`, background: "#1DB954" }}
              />
            </div>
          </div>
          <div
            style={{
              background: "#FFD60A",
              border: "2px solid #0D0D0D",
              padding: "4px 12px",
              fontWeight: 800,
              fontSize: "0.85rem",
            }}
          >
            {Math.round(progress)}%
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              left: 28,
              top: 0,
              bottom: 0,
              width: 3,
              background: "#0D0D0D",
            }}
          />

          <div className="space-y-4">
            {nodes.map((node, index) => (
              <TimelineNode
                key={node.id}
                node={node}
                index={index}
                isTooltipOpen={tooltip === node.id}
                onTooltipToggle={() => setTooltip(tooltip === node.id ? null : node.id)}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={onStart}
            className="brutal-btn flex items-center gap-3 px-8 py-4 text-lg"
            style={{ background: "#FFD60A" }}
          >
            Start Quiz Now
            <ChevronRight size={22} />
          </button>
        </div>

        <p style={{ fontSize: "0.85rem", color: "#888", fontWeight: 500, textAlign: "right", marginTop: 8 }}>
          Brilliant-style: Click any node to see why it matters and what it connects to →
        </p>
      </div>
    </div>
  );
}

function TimelineNode({
  node,
  index,
  isTooltipOpen,
  onTooltipToggle,
}: {
  node: TimelineNode;
  index: number;
  isTooltipOpen: boolean;
  onTooltipToggle: () => void;
}) {
  const statusColors: Record<NodeStatus, string> = {
    completed: "#1DB954",
    active: "#FFD60A",
    locked: "#CCCCCC",
  };

  const StatusIcon = node.status === "completed"
    ? CheckCircle
    : node.status === "locked"
    ? Lock
    : Circle;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 20,
        paddingLeft: 0,
      }}
    >
      {/* Node dot */}
      <div
        style={{
          width: 56,
          height: 56,
          flexShrink: 0,
          background: statusColors[node.status],
          border: "2.5px solid #0D0D0D",
          boxShadow: "3px 3px 0 #0D0D0D",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          cursor: node.status !== "locked" ? "pointer" : "default",
        }}
        onClick={node.status !== "locked" ? onTooltipToggle : undefined}
      >
        <StatusIcon
          size={22}
          color="#0D0D0D"
          strokeWidth={2.5}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, paddingTop: 6 }}>
        <div className="flex items-center gap-3 flex-wrap">
          <span style={{ fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            {index + 1}. {node.label}
          </span>
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 800,
              background: statusColors[node.status],
              border: "1.5px solid #0D0D0D",
              padding: "2px 8px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {node.status}
          </span>
          {node.connects.length > 0 && (
            <div className="flex items-center gap-1">
              <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: 600 }}>→ unlocks:</span>
              {node.connects.map((c) => (
                <span
                  key={c}
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    background: "#F5F0E8",
                    border: "1.5px solid #0D0D0D",
                    padding: "1px 6px",
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          )}
          {node.status !== "locked" && (
            <button
              onClick={onTooltipToggle}
              style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#888", fontWeight: 600, fontSize: "0.78rem" }}
            >
              <Info size={14} />
              Why this?
            </button>
          )}
        </div>

        {/* Expandable */}
        {isTooltipOpen && (
          <div
            className="mt-3"
            style={{
              background: "#FFFFFF",
              border: "2px solid #0D0D0D",
              boxShadow: "4px 4px 0 #0D0D0D",
              padding: "14px 16px",
              maxWidth: 480,
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
              💡 Why this topic matters
            </div>
            <p style={{ fontSize: "0.88rem", fontWeight: 500, color: "#333", lineHeight: 1.6 }}>
              {node.why}
            </p>
            {node.connects.length > 0 && (
              <div style={{ marginTop: 10, fontSize: "0.82rem", fontWeight: 600, color: "#0D0D0D" }}>
                🔗 Mastering this unlocks:{" "}
                <strong>{node.connects.join(", ")}</strong>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
