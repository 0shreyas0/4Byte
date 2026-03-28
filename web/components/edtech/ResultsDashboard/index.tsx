"use client";

import { useState } from "react";
import { AnalysisResult, TopicScore, DOMAIN_DATA } from "@/lib/edtech/conceptGraph";
import { ArrowRight, ChevronRight, RotateCcw, Sliders } from "lucide-react";

interface ResultsDashboardProps {
  domain: string;
  scores: Record<string, TopicScore>;
  analysis: AnalysisResult;
  onSimulate: () => void;
  onRestart: () => void;
}

export default function ResultsDashboard({
  domain,
  scores,
  analysis,
  onSimulate,
  onRestart,
}: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState<"graph" | "analysis" | "explanation" | "path">("graph");

  const totalTopics = Object.keys(scores).length;
  const weakCount = analysis.weakTopics.length;
  const strongCount = analysis.strongTopics.length;
  const overallScore = Math.round(
    Object.values(scores).reduce((s, t) => s + t.score, 0) / Math.max(totalTopics, 1)
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8" }}>
      {/* Header */}
      <div
        style={{
          borderBottom: "2.5px solid #0D0D0D",
          background: "#FFFFFF",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: "#0D0D0D",
            color: "#FFD60A",
            padding: "6px 14px",
            fontWeight: 800,
            fontSize: "1rem",
            letterSpacing: "-0.02em",
          }}
        >
          NeuralPath Results
        </div>
        <div style={{ flex: 1 }}>
          <div className="progress-bar-bg" style={{ height: 8 }}>
            <div className="progress-bar-fill" style={{ width: "80%", background: "#1DB954" }} />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onSimulate}
            className="brutal-btn flex items-center gap-2 px-4 py-2 text-sm"
            style={{ background: "#8B5CF6", color: "#FFFFFF" }}
          >
            <Sliders size={14} />
            Simulate
          </button>
          <button
            onClick={onRestart}
            className="brutal-btn flex items-center gap-2 px-4 py-2 text-sm"
            style={{ background: "#F5F0E8" }}
          >
            <RotateCcw size={14} />
            Restart
          </button>
        </div>
      </div>

      {/* Summary strip */}
      <div
        style={{  
          background: "#0D0D0D",
          borderBottom: "2.5px solid #FFD60A",
          padding: "16px 24px",
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ color: "#888", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Domain</div>
          <div style={{ color: "#FFD60A", fontWeight: 800, fontSize: "1.1rem" }}>{domain}</div>
        </div>
        <div style={{ width: 1, height: 36, background: "#333" }} />
        {[
          { label: "Overall Score", value: `${overallScore}%`, color: overallScore >= 70 ? "#1DB954" : overallScore >= 45 ? "#FFD60A" : "#FF3B3B" },
          { label: "Root Cause", value: analysis.rootCause, color: "#FF3B3B" },
          { label: "Weak Topics", value: String(weakCount), color: "#FF3B3B" },
          { label: "Strong Topics", value: String(strongCount), color: "#1DB954" },
        ].map((s) => (
          <div key={s.label}>
            <div style={{ color: "#888", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</div>
            <div style={{ color: s.color, fontWeight: 800, fontSize: "1.1rem" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        style={{
          borderBottom: "2.5px solid #0D0D0D",
          background: "#FFFFFF",
          display: "flex",
          overflowX: "auto",
        }}
      >
        {[
          { id: "graph", label: "📊 Concept Graph" },
          { id: "analysis", label: "🔍 Analysis" },
          { id: "explanation", label: "🧠 AI Explanation" },
          { id: "path", label: "🗺️ Learning Path" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            style={{
              padding: "14px 24px",
              background: activeTab === tab.id ? "#FFD60A" : "transparent",
              fontWeight: 800,
              fontSize: "0.9rem",
              cursor: "pointer",
              border: "none",
              borderRight: "2px solid #0D0D0D",
              borderBottom: activeTab === tab.id ? "3px solid #0D0D0D" : "none",
              fontFamily: "Space Grotesk, sans-serif",
              whiteSpace: "nowrap" as const,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "graph" && (
          <GraphTab domain={domain} scores={scores} analysis={analysis} />
        )}
        {activeTab === "analysis" && (
          <AnalysisTab scores={scores} analysis={analysis} />
        )}
        {activeTab === "explanation" && (
          <ExplanationTab analysis={analysis} />
        )}
        {activeTab === "path" && (
          <LearningPathTab analysis={analysis} onSimulate={onSimulate} />
        )}
      </div>
    </div>
  );
}

/* ─── Graph Tab ─── */
function GraphTab({
  domain,
  scores,
  analysis,
}: {
  domain: string;
  scores: Record<string, TopicScore>;
  analysis: AnalysisResult;
}) {
  const chainSet = new Set(analysis.dependencyChain);

  const statusColor = (topic: string) => {
    const s = analysis.topicStatuses[topic];
    if (!s) return "#CCCCCC";
    return s === "weak" ? "#FF3B3B" : s === "medium" ? "#FFD60A" : "#1DB954";
  };

  const allTopics = Object.keys(DOMAIN_DATA[domain]?.graph || {});
  const graph = DOMAIN_DATA[domain]?.graph || {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Graph visualization */}
      <div
        className="lg:col-span-2 p-6"
        style={{ border: "2.5px solid #0D0D0D", background: "#FFFFFF", boxShadow: "4px 4px 0 #0D0D0D" }}
      >
        <h2 style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em", marginBottom: 4 }}>
          Concept Dependency Graph
        </h2>
        <p style={{ fontSize: "0.82rem", color: "#666", marginBottom: 16, fontWeight: 500 }}>
          Highlighted chain: {analysis.dependencyChain.join(" → ")}
        </p>

        {/* SVG Graph */}
        <ConceptGraphSVG
          topics={allTopics}
          graph={graph}
          analysis={analysis}
          scores={scores}
        />

        {/* Legend */}
        <div className="flex gap-5 mt-4 flex-wrap">
          {[
            ["#FF3B3B", "Weak (< 45%)"],
            ["#FFD60A", "Medium (45–70%)"],
            ["#1DB954", "Strong (> 70%)"],
            ["#CCCCCC", "Not tested"],
          ].map(([color, label]) => (
            <div key={label} className="flex items-center gap-2">
              <div style={{ width: 14, height: 14, background: color, border: "2px solid #0D0D0D" }} />
              <span style={{ fontSize: "0.78rem", fontWeight: 700 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Score breakdown */}
      <div
        className="p-6"
        style={{ border: "2.5px solid #0D0D0D", background: "#FFFFFF", boxShadow: "4px 4px 0 #0D0D0D" }}
      >
        <h2 style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em", marginBottom: 16 }}>
          Topic Scores
        </h2>
        <div className="space-y-4">
          {Object.entries(scores).map(([topic, data]) => (
            <div key={topic}>
              <div className="flex justify-between items-center mb-1">
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: chainSet.has(topic) ? "#FF3B3B" : "#0D0D0D",
                  }}
                >
                  {chainSet.has(topic) ? "⚡ " : ""}{topic}
                </span>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    color: statusColor(topic),
                  }}
                >
                  {data.score}%
                </span>
              </div>
              <div
                style={{
                  height: 10,
                  background: "#F5F0E8",
                  border: `2px solid ${chainSet.has(topic) ? "#FF3B3B" : "#0D0D0D"}`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${data.score}%`,
                    background: statusColor(topic),
                    transition: "width 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── SVG Graph ─── */
function ConceptGraphSVG({
  topics,
  graph,
  analysis,
  scores,
}: {
  topics: string[];
  graph: Record<string, string[]>;
  analysis: AnalysisResult;
  scores: Record<string, TopicScore>;
}) {
  const W = 560;
  const H = 380;
  const chainSet = new Set(analysis.dependencyChain);

  // Layout: arrange in arcs by depth
  const depths: Record<string, number> = {};
  const roots = topics.filter((t) => (graph[t] || []).length === 0);
  const visited = new Set<string>();

  const assignDepth = (topic: string, depth: number) => {
    if (visited.has(topic)) return;
    visited.add(topic);
    depths[topic] = Math.max(depths[topic] || 0, depth);
    for (const t of topics) {
      if ((graph[t] || []).includes(topic)) {
        assignDepth(t, depth + 1);
      }
    }
  };

  roots.forEach((r) => assignDepth(r, 0));

  const maxDepth = Math.max(...Object.values(depths), 0);
  const byDepth: Record<number, string[]> = {};
  for (const [t, d] of Object.entries(depths)) {
    if (!byDepth[d]) byDepth[d] = [];
    byDepth[d].push(t);
  }

  // Compute positions
  const pos: Record<string, { x: number; y: number }> = {};
  for (let d = 0; d <= maxDepth; d++) {
    const xVal = 60 + (d / Math.max(maxDepth, 1)) * (W - 100);
    const items = byDepth[d] || [];
    items.forEach((t, i) => {
      const yVal = 60 + (i / Math.max(items.length - 1, 1)) * (H - 120);
      pos[t] = { x: xVal, y: items.length === 1 ? H / 2 : yVal };
    });
  }

  const statusColor = (topic: string) => {
    const s = analysis.topicStatuses[topic];
    if (!s) return "#CCCCCC";
    return s === "weak" ? "#FF3B3B" : s === "medium" ? "#FFD60A" : "#1DB954";
  };

  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", border: "2px solid #E5E5E5", background: "#FAFAF5" }}
    >
      {/* Edges */}
      {topics.map((t) =>
        (graph[t] || []).map((dep) => {
          if (!pos[t] || !pos[dep]) return null;
          const isChainEdge = chainSet.has(t) && chainSet.has(dep);
          return (
            <line
              key={`${dep}-${t}`}
              x1={pos[dep].x}
              y1={pos[dep].y}
              x2={pos[t].x}
              y2={pos[t].y}
              stroke={isChainEdge ? "#FF3B3B" : "#CCCCCC"}
              strokeWidth={isChainEdge ? 3 : 1.5}
              strokeDasharray={isChainEdge ? "none" : "4,3"}
            />
          );
        })
      )}

      {/* Nodes */}
      {topics.map((t) => {
        if (!pos[t]) return null;
        const isChain = chainSet.has(t);
        const isRoot = t === analysis.rootCause;
        const r = isRoot ? 26 : isChain ? 22 : 18;
        const color = statusColor(t);
        const isHov = hovered === t;
        const score = scores[t]?.score;

        return (
          <g
            key={t}
            onMouseEnter={() => setHovered(t)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: "pointer" }}
          >
            {/* Shadow */}
            <circle cx={pos[t].x + 3} cy={pos[t].y + 3} r={r} fill="#0D0D0D" opacity={0.25} />
            {/* Node */}
            <circle
              cx={pos[t].x}
              cy={pos[t].y}
              r={r}
              fill={color}
              stroke={isRoot ? "#FF3B3B" : "#0D0D0D"}
              strokeWidth={isRoot ? 3.5 : 2.5}
            />
            {/* Root indicator */}
            {isRoot && (
              <circle
                cx={pos[t].x}
                cy={pos[t].y}
                r={r + 6}
                fill="none"
                stroke="#FF3B3B"
                strokeWidth={2}
                strokeDasharray="4,3"
                opacity={0.7}
              />
            )}
            {/* Label */}
            <text
              x={pos[t].x}
              y={pos[t].y + r + 14}
              textAnchor="middle"
              fill="#0D0D0D"
              fontSize={10}
              fontWeight={isChain ? 800 : 600}
              fontFamily="Space Grotesk, sans-serif"
            >
              {t.length > 10 ? t.slice(0, 9) + "…" : t}
            </text>
            {/* Score badge */}
            {score !== undefined && (
              <text
                x={pos[t].x}
                y={pos[t].y + 4}
                textAnchor="middle"
                fill={color === "#FFD60A" ? "#0D0D0D" : "#FFFFFF"}
                fontSize={9}
                fontWeight={800}
                fontFamily="JetBrains Mono, monospace"
              >
                {score}%
              </text>
            )}
            {/* Hover tooltip */}
            {isHov && (
              <g>
                <rect
                  x={pos[t].x - 55}
                  y={pos[t].y - r - 44}
                  width={110}
                  height={36}
                  fill="#0D0D0D"
                  stroke="#FFD60A"
                  strokeWidth={2}
                  rx={0}
                />
                <text x={pos[t].x} y={pos[t].y - r - 27} textAnchor="middle" fill="#FFD60A" fontSize={9} fontWeight={800} fontFamily="Space Grotesk, sans-serif">
                  {t}
                </text>
                <text x={pos[t].x} y={pos[t].y - r - 14} textAnchor="middle" fill="#888" fontSize={8} fontFamily="Space Grotesk, sans-serif">
                  {analysis.topicStatuses[t]?.toUpperCase() || "NOT TESTED"} {score !== undefined ? `· ${score}%` : ""}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Analysis Tab ─── */
function AnalysisTab({ scores, analysis }: { scores: Record<string, TopicScore>; analysis: AnalysisResult }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Weak topics */}
      <div style={{ border: "2.5px solid #FF3B3B", background: "#FFF0F0", boxShadow: "4px 4px 0 #FF3B3B", padding: 24 }}>
        <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#FF3B3B", marginBottom: 16, letterSpacing: "-0.02em" }}>
          ⚠️ Weak Topics (Score &lt; 45%)
        </h2>
        {analysis.weakTopics.length === 0 ? (
          <p style={{ color: "#555", fontWeight: 600 }}>No weak topics detected! 🎉</p>
        ) : (
          analysis.weakTopics.map((t) => (
            <div
              key={t}
              className="flex items-center justify-between p-3 mb-3"
              style={{ border: "2px solid #FF3B3B", background: "#FFFFFF" }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>{t}</div>
                <div style={{ fontSize: "0.78rem", color: "#888", fontWeight: 600 }}>
                  Time spent: {scores[t]?.time || 0}s
                </div>
              </div>
              <div
                style={{
                  background: "#FF3B3B",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  padding: "4px 12px",
                  fontSize: "1rem",
                }}
              >
                {scores[t]?.score || 0}%
              </div>
            </div>
          ))
        )}
      </div>

      {/* Medium / Strong */}
      <div className="space-y-6">
        {analysis.mediumTopics.length > 0 && (
          <div style={{ border: "2.5px solid #FFD60A", background: "#FFFEF0", boxShadow: "4px 4px 0 #FFD60A", padding: 24 }}>
            <h2 style={{ fontWeight: 800, fontSize: "1rem", color: "#B8860B", marginBottom: 12 }}>
              🟡 Medium Topics (45–70%)
            </h2>
            {analysis.mediumTopics.map((t) => (
              <div
                key={t}
                className="flex items-center justify-between p-3 mb-2"
                style={{ border: "2px solid #FFD60A", background: "#FFFFFF" }}
              >
                <span style={{ fontWeight: 700 }}>{t}</span>
                <span style={{ fontWeight: 800, color: "#B8860B" }}>{scores[t]?.score}%</span>
              </div>
            ))}
          </div>
        )}

        {analysis.strongTopics.length > 0 && (
          <div style={{ border: "2.5px solid #1DB954", background: "#F0FDF4", boxShadow: "4px 4px 0 #1DB954", padding: 24 }}>
            <h2 style={{ fontWeight: 800, fontSize: "1rem", color: "#1DB954", marginBottom: 12 }}>
              ✅ Strong Topics (&gt; 70%)
            </h2>
            {analysis.strongTopics.map((t) => (
              <div
                key={t}
                className="flex items-center justify-between p-3 mb-2"
                style={{ border: "2px solid #1DB954", background: "#FFFFFF" }}
              >
                <span style={{ fontWeight: 700 }}>{t}</span>
                <span style={{ fontWeight: 800, color: "#1DB954" }}>{scores[t]?.score}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Root cause */}
      <div
        className="md:col-span-2 p-6"
        style={{ border: "2.5px solid #0D0D0D", background: "#0D0D0D", boxShadow: "6px 6px 0 #FFD60A" }}
      >
        <div style={{ color: "#FFD60A", fontWeight: 800, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          ⚡ Root Cause Detected
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {analysis.dependencyChain.map((t, i) => (
            <div key={t} className="flex items-center gap-3">
              <div
                style={{
                  background: i === 0 ? "#FF3B3B" : i === analysis.dependencyChain.length - 1 ? "#FFD60A" : "#FFFFFF",
                  color: "#0D0D0D",
                  border: "2.5px solid #FFD60A",
                  padding: "8px 16px",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                }}
              >
                {i === 0 && "⚡ "}
                {t}
              </div>
              {i < analysis.dependencyChain.length - 1 && (
                <ArrowRight size={20} color="#FFD60A" />
              )}
            </div>
          ))}
        </div>
        <p style={{ color: "#888", fontSize: "0.85rem", marginTop: 12, fontWeight: 500 }}>
          This is the dependency chain. Fix the leftmost topic first — it&apos;s the root cause.
        </p>
      </div>
    </div>
  );
}

/* ─── Explanation Tab ─── */
function ExplanationTab({ analysis }: { analysis: AnalysisResult }) {
  const [revealed, setRevealed] = useState(1);

  return (
    <div className="max-w-3xl">
      <h2 style={{ fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.03em", marginBottom: 8 }}>
        🧠 AI Step-by-Step Explanation
      </h2>
      <p style={{ color: "#555", fontSize: "0.9rem", marginBottom: 24, fontWeight: 500 }}>
        Not just &quot;you got it wrong.&quot; Here&apos;s exactly why you&apos;re struggling and what&apos;s causing it.
      </p>

      <div className="space-y-4 mb-8">
        {analysis.explanation.map((line, i) => (
          <div
            key={i}
            style={{
              border: "2.5px solid #0D0D0D",
              background: i === 0 ? "#FFF0F0" : i === analysis.explanation.length - 1 ? "#F0FDF4" : "#FFFFFF",
              boxShadow: "4px 4px 0 #0D0D0D",
              padding: "20px 24px",
              opacity: i < revealed ? 1 : 0.25,
              transition: "opacity 0.3s ease",
              cursor: i >= revealed ? "pointer" : "default",
            }}
            onClick={() => {
              if (i >= revealed) setRevealed(i + 1);
            }}
          >
            <div className="flex items-start gap-4">
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: i === 0 ? "#FF3B3B" : i === analysis.explanation.length - 1 ? "#1DB954" : "#FFD60A",
                  border: "2.5px solid #0D0D0D",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <p style={{ fontSize: "1rem", fontWeight: 600, lineHeight: 1.6, flex: 1 }}>
                {line}
              </p>
            </div>
            {i >= revealed && (
              <div style={{ textAlign: "right", fontSize: "0.78rem", color: "#888", marginTop: 8, fontWeight: 600 }}>
                Click to reveal →
              </div>
            )}
          </div>
        ))}
      </div>

      {revealed < analysis.explanation.length && (
        <button
          onClick={() => setRevealed(analysis.explanation.length)}
          className="brutal-btn px-6 py-3"
          style={{ background: "#FFD60A" }}
        >
          Reveal All Steps
        </button>
      )}

      {/* Chain display */}
      <div
        className="mt-8 p-6"
        style={{ border: "2.5px solid #0D0D0D", background: "#0D0D0D", boxShadow: "4px 4px 0 #FFD60A" }}
      >
        <div style={{ color: "#FFD60A", fontWeight: 800, fontSize: "0.75rem", letterSpacing: "0.1em", marginBottom: 12 }}>
          VISUAL REASONING CHAIN
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {analysis.dependencyChain.map((t, i) => (
            <div key={t} className="flex items-center gap-3">
              <div
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  color: i === 0 ? "#FF3B3B" : "#1DB954",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  padding: "6px 12px",
                  border: `2px solid ${i === 0 ? "#FF3B3B" : "#1DB954"}`,
                  background: i === 0 ? "#FF3B3B22" : "#1DB95422",
                }}
              >
                {i === 0 ? "ROOT: " : ""}{t}
              </div>
              {i < analysis.dependencyChain.length - 1 && (
                <span style={{ color: "#888", fontSize: "1.2rem" }}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Learning Path Tab ─── */
function LearningPathTab({
  analysis,
  onSimulate,
}: {
  analysis: AnalysisResult;
  onSimulate: () => void;
}) {
  return (
    <div className="max-w-3xl">
      <h2 style={{ fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.03em", marginBottom: 8 }}>
        🗺️ Your Personalized Learning Path
      </h2>
      <p style={{ color: "#555", fontSize: "0.9rem", marginBottom: 24, fontWeight: 500 }}>
        Step-by-step recovery plan, ordered by concept dependencies. Complete in order.
      </p>

      <div className="space-y-4 mb-8">
        {analysis.learningPath.map((step, i) => (
          <div
            key={step.topic}
            className="p-6"
            style={{
              border: "2.5px solid #0D0D0D",
              background: "#FFFFFF",
              boxShadow: "5px 5px 0 #0D0D0D",
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: 20,
              alignItems: "start",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                background: i === 0 ? "#FF3B3B" : i === 1 ? "#FFD60A" : "#1DB954",
                border: "2.5px solid #0D0D0D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "1.3rem",
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em", marginBottom: 4 }}>
                {step.action}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "#888",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Topic: {step.topic}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  style={{
                    background: "#F5F0E8",
                    border: "2px solid #0D0D0D",
                    padding: "10px 12px",
                  }}
                >
                  <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#888", marginBottom: 4, letterSpacing: "0.06em" }}>
                    WHY THIS MATTERS
                  </div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, lineHeight: 1.5, color: "#333" }}>
                    {step.why}
                  </p>
                </div>
                <div
                  style={{
                    background: "#F0FDF4",
                    border: "2px solid #1DB954",
                    padding: "10px 12px",
                  }}
                >
                  <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#1DB954", marginBottom: 4, letterSpacing: "0.06em" }}>
                    WHAT IT FIXES
                  </div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, lineHeight: 1.5, color: "#333" }}>
                    {step.fixes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chain visualization */}
      <div
        className="p-6 mb-6"
        style={{ border: "2.5px solid #0D0D0D", background: "#F5F0E8", boxShadow: "4px 4px 0 #0D0D0D" }}
      >
        <div style={{ fontWeight: 800, fontSize: "0.75rem", letterSpacing: "0.08em", color: "#888", marginBottom: 12 }}>
          RECOVERY FLOW
        </div>
        <div className="flex items-center flex-wrap gap-2">
          {analysis.learningPath.map((step, i) => (
            <div key={step.topic} className="flex items-center gap-2">
              <div
                style={{
                  background: i === 0 ? "#FF3B3B" : i === 1 ? "#FFD60A" : "#1DB954",
                  color: "#0D0D0D",
                  border: "2.5px solid #0D0D0D",
                  padding: "8px 16px",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  boxShadow: "3px 3px 0 #0D0D0D",
                }}
              >
                {step.action}
              </div>
              {i < analysis.learningPath.length - 1 && (
                <ChevronRight size={20} color="#0D0D0D" strokeWidth={3} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Simulate CTA */}
      <div
        className="p-6 flex items-center justify-between gap-4 flex-wrap"
        style={{ border: "2.5px solid #8B5CF6", background: "#F5F3FF", boxShadow: "4px 4px 0 #8B5CF6" }}
      >
        <div>
          <div style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em", marginBottom: 4 }}>
            🔮 Want to see the impact?
          </div>
          <p style={{ fontSize: "0.88rem", color: "#555", fontWeight: 500 }}>
            Use Simulation Mode to see how improving one topic cascades to others.
          </p>
        </div>
        <button
          onClick={onSimulate}
          className="brutal-btn flex items-center gap-2 px-6 py-3 text-sm"
          style={{ background: "#8B5CF6", color: "#FFFFFF", flexShrink: 0 }}
        >
          Open Simulator
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
