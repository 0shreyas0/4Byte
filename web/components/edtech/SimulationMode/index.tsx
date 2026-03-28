"use client";

import { useState, useCallback, useMemo } from "react";
import { AnalysisResult, TopicScore, DOMAIN_DATA, simulateImprovement } from "@/lib/edtech/conceptGraph";
import { ArrowLeft, TrendingUp, RefreshCw } from "lucide-react";

interface SimulationModeProps {
  domain: string;
  originalScores: Record<string, TopicScore>;
  originalAnalysis: AnalysisResult;
  onBack: () => void;
}

export default function SimulationMode({
  domain,
  originalScores,
  originalAnalysis,
  onBack,
}: SimulationModeProps) {
  const graph = useMemo(() => DOMAIN_DATA[domain]?.graph || {}, [domain]);

  const [simScores, setSimScores] = useState<Record<string, number>>(
    Object.fromEntries(Object.entries(originalScores).map(([k, v]) => [k, v.score]))
  );
  const [changedTopic, setChangedTopic] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);

  const handleSliderChange = useCallback(
    (topic: string, newScore: number) => {
      const result = simulateImprovement(originalScores, topic, newScore, graph);
      setSimScores(result);
      setChangedTopic(topic);

      const oldScore = originalScores[topic]?.score || 0;
      const improvement = newScore - oldScore;
      if (improvement > 0) {
        const dependents = Object.entries(graph)
          .filter(([t, deps]) => deps.includes(topic) && result[t] !== undefined)
          .map(([t]) => t);

        if (dependents.length > 0) {
          setExplanation(
            `Improving "${topic}" by ${improvement}% boosts: ${dependents.join(", ")} (cascade: ×0.6). ` +
              `This is because they directly depend on "${topic}" in the concept graph.`
          );
        } else {
          setExplanation(
            `"${topic}" improved by ${improvement}%. No other tested topics directly depend on it yet.`
          );
        }
      } else {
        setExplanation(null);
      }
    },
    [originalScores, graph]
  );

  const handleReset = () => {
    setSimScores(Object.fromEntries(Object.entries(originalScores).map(([k, v]) => [k, v.score])));
    setChangedTopic(null);
    setExplanation(null);
  };

  const statusColor = (score: number) => {
    if (score < 45) return "#FF3B3B";
    if (score < 70) return "#FFD60A";
    return "#1DB954";
  };

  const statusLabel = (score: number) => {
    if (score < 45) return "WEAK";
    if (score < 70) return "MEDIUM";
    return "STRONG";
  };

  const topics = Object.keys(originalScores);
  const overallOld = Math.round(Object.values(originalScores).reduce((s, v) => s + v.score, 0) / Math.max(topics.length, 1));
  const overallNew = Math.round(Object.values(simScores).reduce((s, v) => s + v, 0) / Math.max(topics.length, 1));

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8" }}>
      {/* Header */}
      <div
        style={{
          borderBottom: "2.5px solid #0D0D0D",
          background: "#FFFFFF",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <button onClick={onBack} className="brutal-btn flex items-center gap-2 px-4 py-2 text-sm" style={{ background: "#F5F0E8" }}>
          <ArrowLeft size={14} />
          Back to Results
        </button>
        <div style={{ width: 2, height: 28, background: "#0D0D0D" }} />
        <div>
          <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            🔮 Simulation Mode
          </div>
          <div style={{ fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            See How Improvement Cascades — {domain}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={handleReset}
            className="brutal-btn flex items-center gap-2 px-4 py-2 text-sm"
            style={{ background: "#F5F0E8" }}
          >
            <RefreshCw size={14} />
            Reset
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Intro */}
        <div
          className="p-5 mb-8"
          style={{ border: "2.5px solid #8B5CF6", background: "#F5F3FF", boxShadow: "4px 4px 0 #8B5CF6" }}
        >
          <div className="flex items-start gap-3">
            <TrendingUp size={22} color="#8B5CF6" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "#8B5CF6", marginBottom: 4 }}>
                How Simulation Works
              </div>
              <p style={{ fontSize: "0.88rem", fontWeight: 500, color: "#444", lineHeight: 1.6 }}>
                Drag any slider to simulate improving that topic. The system will automatically cascade improvements to all dependent topics
                based on the concept graph (cascade factor: ×0.6). This is exactly how improving one root concept helps everything downstream.
              </p>
            </div>
          </div>
        </div>

        {/* Overall score delta */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Original Score", value: `${overallOld}%`, color: statusColor(overallOld), sub: "Before simulation" },
            { label: "Simulated Score", value: `${overallNew}%`, color: statusColor(overallNew), sub: "After improvement" },
            {
              label: "Net Gain",
              value: `+${Math.max(0, overallNew - overallOld)}%`,
              color: overallNew > overallOld ? "#1DB954" : "#888",
              sub: "Overall change",
            },
            {
              label: "Adjusted Topic",
              value: changedTopic || "—",
              color: "#8B5CF6",
              sub: "You changed this",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                border: "2.5px solid #0D0D0D",
                background: "#FFFFFF",
                boxShadow: "3px 3px 0 #0D0D0D",
                padding: "16px 20px",
              }}
            >
              <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                {s.label}
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: s.color, letterSpacing: "-0.03em", lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#888", fontWeight: 600, marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* AI Explanation */}
        {explanation && (
          <div
            className="p-5 mb-8"
            style={{
              border: "2.5px solid #1DB954",
              background: "#F0FDF4",
              boxShadow: "4px 4px 0 #1DB954",
            }}
          >
            <div style={{ fontWeight: 800, fontSize: "0.8rem", color: "#1DB954", letterSpacing: "0.06em", marginBottom: 6 }}>
              🧠 AI EXPLAINS THE CASCADE
            </div>
            <p style={{ fontSize: "0.92rem", fontWeight: 600, color: "#333", lineHeight: 1.6 }}>
              {explanation}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sliders */}
          <div
            style={{
              border: "2.5px solid #0D0D0D",
              background: "#FFFFFF",
              boxShadow: "4px 4px 0 #0D0D0D",
              padding: 24,
            }}
          >
            <h2 style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em", marginBottom: 4 }}>
              Adjust Topic Scores
            </h2>
            <p style={{ fontSize: "0.82rem", color: "#666", marginBottom: 20, fontWeight: 500 }}>
              Drag sliders to simulate improvement. Watch the cascade happen in real-time.
            </p>

            <div className="space-y-6">
              {topics.map((topic) => {
                const original = originalScores[topic]?.score || 0;
                const current = simScores[topic] ?? original;
                const changed = Math.round(current) !== original;
                const isRoot = topic === originalAnalysis.rootCause;

                return (
                  <div key={topic}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span style={{ fontWeight: 800, fontSize: "0.9rem" }}>
                          {isRoot && "⚡ "}{topic}
                        </span>
                        {isRoot && (
                          <span
                            style={{
                              fontSize: "0.6rem",
                              fontWeight: 800,
                              background: "#FF3B3B",
                              color: "#FFF",
                              padding: "1px 6px",
                              border: "1.5px solid #0D0D0D",
                            }}
                          >
                            ROOT CAUSE
                          </span>
                        )}
                        {changed && (
                          <span
                            style={{
                              fontSize: "0.6rem",
                              fontWeight: 800,
                              background: "#8B5CF6",
                              color: "#FFF",
                              padding: "1px 6px",
                              border: "1.5px solid #0D0D0D",
                            }}
                          >
                            {topic === changedTopic ? "ADJUSTED" : "CASCADED"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {changed && (
                          <span style={{ fontSize: "0.78rem", color: "#888", fontWeight: 700, textDecoration: "line-through" }}>
                            {original}%
                          </span>
                        )}
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: "1rem",
                            color: statusColor(current),
                            minWidth: 40,
                            textAlign: "right",
                          }}
                        >
                          {Math.round(current)}%
                        </span>
                      </div>
                    </div>

                    {/* Track + thumb */}
                    <div style={{ position: "relative" }}>
                      {/* Original marker */}
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: `${original}%`,
                          transform: "translate(-50%, -50%)",
                          width: 3,
                          height: 20,
                          background: "#888",
                          zIndex: 2,
                          pointerEvents: "none",
                        }}
                      />
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={topic === changedTopic ? Math.round(simScores[topic] ?? original) : original}
                        disabled={topic !== changedTopic && changedTopic !== null}
                        onChange={(e) => handleSliderChange(topic, Number(e.target.value))}
                        onClick={() => {
                          if (changedTopic && changedTopic !== topic) handleReset();
                        }}
                        style={{
                          width: "100%",
                          accentColor: statusColor(current),
                          cursor: changedTopic && changedTopic !== topic ? "not-allowed" : "pointer",
                          opacity: changedTopic && changedTopic !== topic ? 0.5 : 1,
                        }}
                      />
                    </div>

                    {/* Status bar */}
                    <div
                      style={{
                        height: 6,
                        background: "#F5F0E8",
                        border: "1.5px solid #CCCCCC",
                        overflow: "hidden",
                        marginTop: 4,
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.round(current)}%`,
                          background: statusColor(current),
                          transition: "width 0.4s ease, background 0.3s",
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                      <span style={{ fontSize: "0.65rem", color: "#888", fontWeight: 700 }}>
                        {statusLabel(current)}
                      </span>
                      {changed && topic !== changedTopic && (
                        <span style={{ fontSize: "0.65rem", color: "#8B5CF6", fontWeight: 700 }}>
                          +{Math.round(current - original)}% cascade
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <p style={{ fontSize: "0.78rem", color: "#888", fontWeight: 600, marginTop: 16 }}>
              💡 The grey marker shows your original score. Drag to the right to simulate improvement.
            </p>
          </div>

          {/* Visual comparison */}
          <div
            style={{
              border: "2.5px solid #0D0D0D",
              background: "#FFFFFF",
              boxShadow: "4px 4px 0 #0D0D0D",
              padding: 24,
            }}
          >
            <h2 style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em", marginBottom: 4 }}>
              Before vs After
            </h2>
            <p style={{ fontSize: "0.82rem", color: "#666", marginBottom: 20, fontWeight: 500 }}>
              Real-time comparison of original vs. simulated scores.
            </p>

            <div className="space-y-4">
              {topics.map((topic) => {
                const original = originalScores[topic]?.score || 0;
                const current = Math.round(simScores[topic] ?? original);
                const delta = current - original;
                const isChanged = current !== original;

                return (
                  <div key={topic}>
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>{topic}</span>
                      <div className="flex items-center gap-2">
                        {isChanged && (
                          <span
                            style={{
                              fontSize: "0.78rem",
                              fontWeight: 800,
                              color: "#1DB954",
                            }}
                          >
                            +{delta.toFixed(0)}%
                          </span>
                        )}
                        <span style={{ fontWeight: 800, fontSize: "0.85rem", color: statusColor(current) }}>
                          {current}%
                        </span>
                      </div>
                    </div>

                    {/* Stacked bars */}
                    <div style={{ position: "relative", height: 16, background: "#F5F0E8", border: "2px solid #CCCCCC" }}>
                      {/* Original */}
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          height: "100%",
                          width: `${original}%`,
                          background: "#CCCCCC",
                          opacity: 0.5,
                        }}
                      />
                      {/* New */}
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          height: "100%",
                          width: `${current}%`,
                          background: statusColor(current),
                          transition: "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                          opacity: isChanged ? 1 : 0.7,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dependency insight */}
            {changedTopic && (
              <div
                className="mt-6 p-4"
                style={{
                  border: "2px solid #8B5CF6",
                  background: "#F5F3FF",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.8rem",
                }}
              >
                <div style={{ color: "#8B5CF6", fontWeight: 800, marginBottom: 8 }}>
                  Cascade Tree:
                </div>
                <div style={{ color: "#444", lineHeight: 2 }}>
                  <span style={{ color: "#FF3B3B", fontWeight: 700 }}>{changedTopic}</span>
                  {Object.entries(graph)
                    .filter(([t, deps]) => deps.includes(changedTopic) && simScores[t] !== undefined)
                    .map(([t]) => (
                      <span key={t}>
                        {" → "}
                        <span style={{ color: "#1DB954", fontWeight: 700 }}>{t}</span>
                        {Object.entries(graph)
                          .filter(([t2, deps2]) => deps2.includes(t) && simScores[t2] !== undefined)
                          .map(([t2]) => (
                            <span key={t2}>
                              {" → "}
                              <span style={{ color: "#3B82F6", fontWeight: 700 }}>{t2}</span>
                            </span>
                          ))}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
