"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Trophy, ArrowRight, AlertCircle } from "lucide-react";
import { QUIZ_DATA } from "@/lib/edtech/quizData";
import { TopicScore } from "@/lib/edtech/conceptGraph";

interface QuizScreenProps {
  domain: string;
  onComplete: (scores: Record<string, TopicScore>, results: QuestionResult[]) => void;
  onBack: () => void;
}

type AnswerState = "idle" | "correct" | "wrong";

interface QuestionResult {
  questionId: string;
  topic: string;
  concept: string; // 🔥 Added: micro-gap concept
  isCorrect: boolean;
  timeSpent: number;
}

export default function QuizScreen({ domain, onComplete, onBack }: QuizScreenProps) {
  const questions = QUIZ_DATA[domain] || QUIZ_DATA["DSA"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [questionStart, setQuestionStart] = useState(() => Date.now());
  const [showExplanation, setShowExplanation] = useState(false);
  // Key-cycling trick: changing this causes the options div to re-mount
  // which re-triggers the shake CSS animation
  const [shakeKey, setShakeKey] = useState(0);

  const current = questions[currentIndex];
  const progress = (currentIndex / questions.length) * 100;
  const isLast = currentIndex === questions.length - 1;

  const handleSelect = (idx: number) => {
    if (answerState !== "idle") return;
    setSelectedOption(idx);
    const isCorrect = idx === current.correctIndex;
    setAnswerState(isCorrect ? "correct" : "wrong");

    if (!isCorrect) setShakeKey((k) => k + 1);

    const timeSpent = Math.round((Date.now() - questionStart) / 1000);
    setResults((prev) => [
      ...prev,
      { 
        questionId: current.id, 
        topic: current.topic, 
        concept: current.concept, // 🔥 Now tracked from QUIZ_DATA
        isCorrect, 
        timeSpent 
      },
    ]);

    // Small delay before showing explanation so the shake/color lands first
    setTimeout(() => setShowExplanation(true), 300);
  };

  const handleNext = () => {
    if (isLast) {
      const topicData: Record<string, { correct: number; total: number; time: number }> = {};
      for (const r of results) {
        if (!topicData[r.topic]) topicData[r.topic] = { correct: 0, total: 0, time: 0 };
        topicData[r.topic].total++;
        if (r.isCorrect) topicData[r.topic].correct++;
        topicData[r.topic].time += r.timeSpent;
      }
      const scores: Record<string, TopicScore> = {};
      for (const [topic, data] of Object.entries(topicData)) {
        scores[topic] = {
          score: Math.round((data.correct / data.total) * 100),
          time: data.time,
        };
      }
      onComplete(scores, results);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setAnswerState("idle");
      setShowExplanation(false);
      setQuestionStart(Date.now());
    }
  };

  // ─── Option appearance helpers ──────────────────────────────────────────────
  const optionStyle = (idx: number): React.CSSProperties => {
    if (answerState === "idle") {
      return {
        background: "#FFFFFF",
        border: "3px solid #0D0D0D",
        color: "#0D0D0D",
        boxShadow: "4px 4px 0 #0D0D0D",
        cursor: "pointer",
      };
    }
    if (idx === current.correctIndex) {
      return {
        background: "linear-gradient(135deg, #1DB954 0%, #17a348 100%)",
        border: "3px solid #0D0D0D",
        color: "#000",
        boxShadow: "4px 4px 0 rgba(29,185,84,0.25)",
        cursor: "default",
      };
    }
    if (idx === selectedOption && answerState === "wrong") {
      return {
        background: "linear-gradient(135deg, #FF3B3B 0%, #e63232 100%)",
        border: "3px solid #0D0D0D",
        color: "#fff",
        boxShadow: "4px 4px 0 rgba(255,59,59,0.25)",
        cursor: "default",
      };
    }
    return {
      background: "#F0EEEA",
      border: "3px solid #CCCCCC",
      color: "rgba(13,13,13,0.35)",
      boxShadow: "none",
      cursor: "default",
    };
  };

  const optionLabelStyle = (idx: number): React.CSSProperties => {
    if (answerState === "idle")
      return { background: "linear-gradient(135deg, #0D0D0D 0%, #222 100%)", color: "#FFD60A" };
    if (idx === current.correctIndex)
      return { background: "#0D0D0D", color: "#1DB954" };
    if (idx === selectedOption && answerState === "wrong")
      return { background: "#0D0D0D", color: "#FF3B3B" };
    return { background: "#CCCCCC", color: "rgba(13,13,13,0.35)" };
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8" }}>
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div
        style={{
          borderBottom: "3px solid #0D0D0D",
          background: "#FFFFFF",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button onClick={onBack} className="brutal-btn px-3 py-1.5 text-sm" style={{ background: "#F5F0E8" }}>
          ← Exit
        </button>
        <div style={{ flex: 1 }}>
          <div className="flex items-center justify-between mb-1.5">
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#666", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 800,
                background: getTopicColor(current.topic),
                border: "2px solid #0D0D0D",
                padding: "2px 8px",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {current.topic}
            </span>
          </div>
          {/* Progress bar with % label */}
          <div className="progress-bar-bg" style={{ height: 20, position: "relative" }}>
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%`, transition: "width 0.5s ease", background: "#FFD60A", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6 }}
            >
              {progress > 10 && (
                <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#0D0D0D", mixBlendMode: "multiply" }}>
                  {Math.round(progress)}%
                </span>
              )}
            </div>
            {progress <= 10 && (
              <span style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", fontSize: "0.65rem", fontWeight: 800, color: "#0D0D0D" }}>
                {Math.round(progress)}%
              </span>
            )}
          </div>
        </div>
        <div style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.03em" }}>{domain}</div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8 space-y-5">
        {/* ── Segmented tracker strips ──────────────────────────────────── */}
        <div className="flex items-center gap-1.5">
          {questions.map((q, i) => {
            const result = results.find((r) => r.questionId === q.id);
            return (
              <div
                key={q.id}
                className="flex-1 transition-all duration-300"
                style={{
                  height: 10,
                  border: "2px solid #0D0D0D",
                  background:
                    i < currentIndex
                      ? result?.isCorrect
                        ? "#1DB954"
                        : "#FF3B3B"
                      : i === currentIndex
                      ? "#FFD60A"
                      : "#E0E0E0",
                }}
              />
            );
          })}
        </div>

        {/* ── Question card ──────────────────────────────────────────────── */}
        <div
          className="p-6"
          style={{
            border: "3px solid #0D0D0D",
            background: "#FFFFFF",
            boxShadow: "6px 6px 0 #0D0D0D",
          }}
        >
          <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
            Q{currentIndex + 1}.
          </div>
          <p style={{ fontSize: "1.15rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.55, fontFamily: "JetBrains Mono, monospace" }}>
            {current.question}
          </p>
        </div>

        {/* ── Options — key cycling re-triggers shake on wrong ──────────── */}
        <div
          key={`options-${current.id}-${shakeKey}`}
          className={`space-y-3 ${answerState === "wrong" ? "shake" : ""}`}
        >
          {current.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={answerState !== "idle"}
              className="w-full flex items-center gap-4 text-left transition-all duration-150"
              style={{
                ...optionStyle(idx),
                padding: "14px 18px",
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 700,
                fontSize: "0.95rem",
                lineHeight: 1.4,
              }}
            >
              {/* Letter badge */}
              <div
                className="shrink-0 flex items-center justify-center"
                style={{
                  width: 34,
                  height: 34,
                  border: "2px solid #0D0D0D",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  ...optionLabelStyle(idx),
                }}
              >
                {answerState !== "idle" && idx === current.correctIndex
                  ? "✓"
                  : answerState !== "idle" && idx === selectedOption && answerState === "wrong"
                  ? "✗"
                  : String.fromCharCode(65 + idx)}
              </div>

              <span className="flex-1">{opt}</span>

              {answerState !== "idle" && idx === current.correctIndex && (
                <CheckCircle2 size={18} className="shrink-0 animate-bounce" />
              )}
              {answerState === "wrong" && idx === selectedOption && (
                <XCircle size={18} className="shrink-0" />
              )}
            </button>
          ))}
        </div>

        {/* ── Explanation panel — gradient bg matching answer ────────────── */}
        {showExplanation && (
          <div
            className="p-5 pop-in"
            style={{
              border: "3px solid #0D0D0D",
              background:
                answerState === "correct"
                  ? "linear-gradient(135deg, #1DB954 0%, #17a348 100%)"
                  : "linear-gradient(135deg, #FF3B3B 0%, #e63232 100%)",
              boxShadow:
                answerState === "correct"
                  ? "4px 4px 0 rgba(29,185,84,0.2)"
                  : "4px 4px 0 rgba(255,59,59,0.2)",
            }}
          >
            <div className="flex items-start gap-3">
              {answerState === "correct" ? (
                <CheckCircle2 size={20} color="#0D0D0D" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
              ) : (
                <AlertCircle size={20} color="#fff" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
              )}
              <div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    marginBottom: 6,
                    color: answerState === "correct" ? "#0D0D0D" : "#fff",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {answerState === "correct" ? "✅ Correct!" : "❌ Wrong!"}
                </div>
                <p style={{ fontSize: "0.9rem", fontWeight: 600, lineHeight: 1.65, color: answerState === "correct" ? "#0D0D0D" : "#fff" }}>
                  {current.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Next / Results button — full-width with pop-in ──────────────── */}
        {answerState !== "idle" && (
          <button
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-3 py-4 pop-in group brutal-btn"
            style={{
              background: "#0D0D0D",
              color: "#FFD60A",
              fontSize: "0.9rem",
              fontWeight: 800,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              boxShadow: "6px 6px 0 #FFD60A",
            }}
          >
            {isLast ? (
              <>
                <Trophy size={20} className="group-hover:animate-bounce" />
                See My Results
              </>
            ) : (
              <>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                Next Question
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function getTopicColor(topic: string): string {
  const colors: Record<string, string> = {
    Loops: "#FFD60A",
    Arrays: "#F97316",
    Sorting: "#FF3B3B",
    Searching: "#8B5CF6",
    Variables: "#3B82F6",
    Recursion: "#EC4899",
    "HTML Basics": "#F97316",
    "CSS Basics": "#3B82F6",
    "JS Basics": "#FFD60A",
    DOM: "#1DB954",
    Events: "#FF3B3B",
    "Fetch/API": "#8B5CF6",
    Flexbox: "#EC4899",
    "React Basics": "#06B6D4",
    Arithmetic: "#FFD60A",
    Percentages: "#F97316",
    Ratios: "#1DB954",
    Algebra: "#3B82F6",
    "Time & Work": "#FF3B3B",
    "Profit & Loss": "#8B5CF6",
    "Time & Distance": "#EC4899",
    Probability: "#06B6D4",
  };
  return colors[topic] || "#F5F0E8";
}
