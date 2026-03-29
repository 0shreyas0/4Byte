"use client";

import { useState } from "react";
import { Lock, CheckCircle, Circle, ChevronRight, Info } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { getAvailableQuizStages, getTimelineNodesForDomain } from "@/lib/edtech/domainStages";

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

export default function LearningTimeline({ domain, onStart, onBack }: TimelineProps) {
  const { profile } = useAuth();
  const [tooltip, setTooltip] = useState<string | null>(null);
  const completedStages = profile?.domainStageProgress?.[domain]?.completedStages ?? 0;
  const availableStages = getAvailableQuizStages(domain);
  const nodes = getTimelineNodesForDomain(domain).map((node, index) => ({
    ...node,
    status: (index < completedStages
      ? "completed"
      : index === completedStages && completedStages < availableStages
      ? "active"
      : "locked") as NodeStatus,
  }));

  const completed = nodes.filter((n) => n.status === "completed").length;
  const total = nodes.length;
  const progress = (completed / total) * 100;
  const hasPlayableStage = completedStages < availableStages;
  const nextNodeLabel = nodes[completedStages]?.label ?? "Next Quiz";

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8" }}>
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
            <div className="flex gap-3">
              {[
                { color: "#1DB954", label: "Done" },
                { color: "#FFD60A", label: "Active" },
                { color: "#CCCCCC", label: "Locked" },
              ].map((legend) => (
                <div key={legend.label} className="flex items-center gap-1.5">
                  <div style={{ width: 12, height: 12, background: legend.color, border: "2px solid #0D0D0D" }} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{legend.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

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
              <div className="progress-bar-fill" style={{ width: `${progress}%`, background: "#1DB954" }} />
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

        <div className="relative">
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
              <TimelineNodeCard
                key={node.id}
                node={node}
                index={index}
                isTooltipOpen={tooltip === node.id}
                onTooltipToggle={() => setTooltip(tooltip === node.id ? null : node.id)}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <button
            onClick={onStart}
            disabled={!hasPlayableStage}
            className="brutal-btn flex items-center gap-3 px-8 py-4 text-lg"
            style={{ background: hasPlayableStage ? "#FFD60A" : "#DDD", opacity: hasPlayableStage ? 1 : 0.65, cursor: hasPlayableStage ? "pointer" : "not-allowed" }}
          >
            {hasPlayableStage ? `Start ${nextNodeLabel} Quiz` : "More Quizzes Coming Soon"}
            <ChevronRight size={22} />
          </button>
        </div>

        <p style={{ fontSize: "0.85rem", color: "#888", fontWeight: 500, textAlign: "right", marginTop: 8 }}>
          Click any unlocked node to see why it matters and what it connects to →
        </p>
      </div>
    </div>
  );
}

function TimelineNodeCard({
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

  const StatusIcon =
    node.status === "completed"
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
        <StatusIcon size={22} color="#0D0D0D" strokeWidth={2.5} />
      </div>

      <div
        style={{
          flex: 1,
          background: "#FFFFFF",
          border: "2.5px solid #0D0D0D",
          boxShadow: "4px 4px 0 #0D0D0D",
          padding: "16px 18px",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#666", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              Node {index + 1}
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              {node.label}
            </div>
          </div>
          <button
            onClick={node.status !== "locked" ? onTooltipToggle : undefined}
            disabled={node.status === "locked"}
            style={{
              border: "2px solid #0D0D0D",
              background: node.status === "locked" ? "#E5E5E5" : "#F5F0E8",
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: node.status === "locked" ? "not-allowed" : "pointer",
            }}
          >
            <Info size={16} />
          </button>
        </div>

        {isTooltipOpen && (
          <div
            style={{
              marginTop: 14,
              borderTop: "2px solid #0D0D0D",
              paddingTop: 14,
              display: "grid",
              gap: 10,
            }}
          >
            <p style={{ fontSize: "0.9rem", color: "#333", lineHeight: 1.55 }}>{node.why}</p>
            <div className="flex flex-wrap gap-2">
              {node.connects.length > 0 ? (
                node.connects.map((link) => (
                  <span
                    key={link}
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "4px 8px",
                      border: "2px solid #0D0D0D",
                      background: "#FFD60A",
                    }}
                  >
                    Unlocks {link}
                  </span>
                ))
              ) : (
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "4px 8px",
                    border: "2px solid #0D0D0D",
                    background: "#F5F0E8",
                  }}
                >
                  Terminal concept
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
