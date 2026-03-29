"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { analyzePerformanceAI, AnalysisResponse } from "@/lib/rag";
import { TopicScore, QuestionResult } from "@/lib/edtech/conceptGraph";

interface AIProcessingScreenProps {
  onComplete: (aiResult: AnalysisResponse | null) => void;
  scores: Record<string, TopicScore>;
  results: QuestionResult[];
  domain: string;
}

const MESSAGES = [
  { text: "Collecting your quiz performance…", icon: "📊" },
  { text: "Building concept dependency graph…", icon: "🕸️" },
  { text: "Analyzing topic scores & patterns…", icon: "🔍" },
  { text: "Tracing dependency chain…", icon: "🔗" },
  { text: "Identifying root cause of failure…", icon: "⚡" },
  { text: "Generating step-by-step explanation…", icon: "🧠" },
  { text: "Building personalized learning path…", icon: "🗺️" },
  { text: "Analysis complete!", icon: "✅" },
];

const STEPS = [
  { label: "Input Analysis", detail: "Quiz performance data collected" },
  { label: "Graph Construction", detail: "Dependency edges mapped" },
  { label: "Weak Detection", detail: "Score threshold: < 50%" },
  { label: "Root Cause", detail: "Traversing dependency tree" },
  { label: "Explanation", detail: "Generating reasoning chain" },
  { label: "Learning Path", detail: "Ordered recovery steps" },
];

export default function AIProcessingScreen({ onComplete, scores, results, domain }: AIProcessingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [stepsDone, setStepsDone] = useState(0);
  const [dots, setDots] = useState("");
  const aiResultRef = useRef<AnalysisResponse | null>(null);
  const animationsDoneRef = useRef(false);
  const aiDoneRef = useRef(false);
  const completedRef = useRef(false);
  const startedRef = useRef(false);

  const tryComplete = useCallback(() => {
    if (aiDoneRef.current && !completedRef.current) {
      completedRef.current = true;
      onComplete(aiResultRef.current);
    }
  }, [onComplete]);

  useEffect(() => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    // 1. Start AI Analysis in background
    const runAnalysis = async () => {
      try {
        const weakTopics = Object.entries(scores)
          .filter(([_, s]) => s.score < 60)
          .map(([t]) => t);
        const microGaps = results.filter(r => !r.isCorrect && r.concept).map(r => r.concept!);
        const rootCause = weakTopics.length > 0 ? weakTopics[0] : (microGaps[0] || "Foundations");

        const mappedResults = results.map(r => ({
          question_id: r.questionId,
          topic: r.topic,
          concept: r.concept || "General",
          is_correct: r.isCorrect,
          time_spent: r.timeSpent
        }));

        const res = await analyzePerformanceAI(domain, weakTopics, microGaps, rootCause, mappedResults);
        aiResultRef.current = res;
      } catch (err) {
        console.error("AI Analysis failed:", err);
      } finally {
        aiDoneRef.current = true;
        tryComplete();
      }
    };

    runAnalysis();

    const msgInterval = setInterval(() => {
      setMessageIndex((i) => {
        const next = i >= MESSAGES.length - 1 ? i : i + 1;
        if (next >= MESSAGES.length - 1) {
          // Mark animations as done and try to complete
          setTimeout(() => {
            animationsDoneRef.current = true;
            tryComplete();
          }, 500);
        }
        return next;
      });
    }, 700);

    const stepInterval = setInterval(() => {
      setStepsDone((s) => {
        if (s >= STEPS.length) {
          clearInterval(stepInterval);
          return s;
        }
        return s + 1;
      });
    }, 650);

    const dotInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);

    // Safety net: 60 seconds max
    const safetyTimeout = setTimeout(() => {
      if (!completedRef.current) {
        console.warn("AI Analysis safety timeout (60s). Proceeding with available data.");
        completedRef.current = true;
        onComplete(aiResultRef.current);
      }
    }, 60000);

    return () => {
      clearInterval(msgInterval);
      clearInterval(stepInterval);
      clearInterval(dotInterval);
      clearTimeout(safetyTimeout);
    };
  }, [onComplete, scores, results, domain, tryComplete]);

  const progress = ((messageIndex + 1) / MESSAGES.length) * 100;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0D0D0D",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: 620, width: "100%" }}>
        {/* Main card */}
        <div
          style={{
            border: "3px solid #FFD60A",
            background: "#1A1A1A",
            boxShadow: "8px 8px 0 #FFD60A",
            padding: "40px",
            marginBottom: 24,
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div
              style={{
                width: 52,
                height: 52,
                border: "2.5px solid #FFD60A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                background: "#0D0D0D",
              }}
              className="animate-spin-slow"
            >
              🧠
            </div>
            <div>
              <h1 style={{ color: "#FFD60A", fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.03em" }}>
                NeuralPath AI
              </h1>
              <p style={{ color: "#888", fontSize: "0.85rem", fontWeight: 500 }}>
                Adaptive Intelligence Engine
              </p>
            </div>
            <div className="ml-auto flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    background: "#FFD60A",
                    borderRadius: "50%",
                    animation: `dot-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Current message */}
          <div
            style={{
              background: "#0D0D0D",
              border: "2px solid #FFD60A",
              padding: "20px 24px",
              marginBottom: 24,
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            <div style={{ color: "#888", fontSize: "0.75rem", marginBottom: 8 }}>
              &gt; neural_path --analyze --mode verbose
            </div>
            <div
              style={{
                color: "#1DB954",
                fontSize: "1rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>{MESSAGES[messageIndex].icon}</span>
              <span>{MESSAGES[messageIndex].text}</span>
              {messageIndex < MESSAGES.length - 1 && (
                <span className="animate-blink" style={{ color: "#FFD60A" }}>
                  {dots}
                </span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-2">
            <div className="flex justify-between mb-1">
              <span style={{ color: "#888", fontSize: "0.78rem", fontWeight: 700 }}>ANALYSIS PROGRESS</span>
              <span style={{ color: "#FFD60A", fontSize: "0.78rem", fontWeight: 800 }}>{Math.round(progress)}%</span>
            </div>
            <div
              style={{
                height: 12,
                background: "#0D0D0D",
                border: "2px solid #333",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #1DB954, #FFD60A)",
                  width: `${progress}%`,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>
        </div>

        {/* Steps card */}
        <div
          style={{
            border: "2.5px solid #333",
            background: "#1A1A1A",
            padding: "20px 24px",
          }}
        >
          <div style={{ color: "#888", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            Processing Steps
          </div>
          <div className="space-y-2">
            {STEPS.map((step, i) => {
              const done = i < stepsDone;
              const active = i === stepsDone;
              return (
                <div
                  key={step.label}
                  className="flex items-center gap-3"
                  style={{ opacity: done || active ? 1 : 0.3 }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      border: `2px solid ${done ? "#1DB954" : active ? "#FFD60A" : "#333"}`,
                      background: done ? "#1DB954" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: "0.7rem",
                      color: done ? "#0D0D0D" : "#FFD60A",
                      fontWeight: 800,
                    }}
                  >
                    {done ? "✓" : active ? "▶" : ""}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: done ? "#FFFFFF" : active ? "#FFD60A" : "#888", fontWeight: 700, fontSize: "0.85rem" }}>
                      {step.label}
                    </span>
                    <span style={{ color: "#555", fontSize: "0.78rem", marginLeft: 8 }}>
                      — {step.detail}
                    </span>
                  </div>
                  {done && (
                    <span style={{ color: "#1DB954", fontSize: "0.75rem", fontWeight: 700 }}>DONE</span>
                  )}
                  {active && (
                    <span style={{ color: "#FFD60A", fontSize: "0.75rem", fontWeight: 700 }}>
                      RUNNING{dots}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <p style={{ color: "#555", fontSize: "0.8rem", textAlign: "center", marginTop: 16, fontWeight: 500 }}>
          This only shows what the reasoning chain — not just a spinner.
        </p>
      </div>

      {/* dot-pulse keyframes are defined in globals.css as @keyframes dot-pulse */}
    </div>
  );
}
