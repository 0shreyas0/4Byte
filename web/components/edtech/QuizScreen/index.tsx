"use client";

import { useState } from "react";
import { CheckCircle, XCircle, ChevronRight, AlertCircle } from "lucide-react";
import { QUIZ_DATA } from "@/lib/edtech/quizData";
import { TopicScore } from "@/lib/edtech/conceptGraph";

interface QuizScreenProps {
  domain: string;
  onComplete: (scores: Record<string, TopicScore>) => void;
  onBack: () => void;
}

type AnswerState = "idle" | "correct" | "wrong";

interface QuestionResult {
  questionId: string;
  topic: string;
  isCorrect: boolean;
  timeSpent: number;
}

export default function QuizScreen({ domain, onComplete, onBack }: QuizScreenProps) {
  const questions = QUIZ_DATA[domain] || QUIZ_DATA["DSA"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [startTime] = useState(() => Date.now());
  const [questionStart, setQuestionStart] = useState(() => Date.now());
  const [showExplanation, setShowExplanation] = useState(false);

  const current = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;
  const isLast = currentIndex === questions.length - 1;

  const handleSelect = (idx: number) => {
    if (answerState !== "idle") return;
    setSelectedOption(idx);
    const isCorrect = idx === current.correctIndex;
    setAnswerState(isCorrect ? "correct" : "wrong");
    setShowExplanation(true);

    const now = new Date().getTime();
    const timeSpent = Math.round((now - questionStart) / 1000);
    const qId = current.id;
    const qTopic = current.topic;
    setResults((prev) => [
      ...prev,
      { questionId: qId, topic: qTopic, isCorrect, timeSpent },
    ]);
  };

  const handleNext = () => {
    if (isLast) {
      // Calculate scores
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

      // Add some fixed context scores for topics not explicitly tested
      // so the graph has more to work with
      onComplete(scores);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setAnswerState("idle");
      setShowExplanation(false);
      setQuestionStart(new Date().getTime());
    }
  };

  const optionBg = (idx: number) => {
    if (answerState === "idle") return "#FFFFFF";
    if (idx === current.correctIndex) return "#1DB954";
    if (idx === selectedOption && answerState === "wrong") return "#FF3B3B";
    return "#FFFFFF";
  };

  const optionTextColor = (idx: number) => {
    if (answerState === "idle") return "#0D0D0D";
    if (idx === current.correctIndex) return "#FFFFFF";
    if (idx === selectedOption && answerState === "wrong") return "#FFFFFF";
    return "#888";
  };

  const optionBorder = (idx: number) => {
    if (answerState === "idle") return "2.5px solid #0D0D0D";
    if (idx === current.correctIndex) return "2.5px solid #1DB954";
    if (idx === selectedOption && answerState === "wrong") return "2.5px solid #FF3B3B";
    return "2.5px solid #CCCCCC";
  };

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
          gap: "16px",
        }}
      >
        <button onClick={onBack} className="brutal-btn px-3 py-1.5 text-sm" style={{ background: "#F5F0E8" }}>
          ← Exit
        </button>
        <div style={{ flex: 1 }}>
          <div className="flex items-center justify-between mb-1">
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#666" }}>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                background: getTopicColor(current.topic),
                border: "1.5px solid #0D0D0D",
                padding: "2px 8px",
              }}
            >
              {current.topic}
            </span>
          </div>
          <div className="progress-bar-bg" style={{ height: 10 }}>
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%`, transition: "width 0.4s ease", background: "#FFD60A" }}
            />
          </div>
        </div>
        <div style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
          {domain}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Score tracker dots */}
        <div className="flex gap-2 mb-8">
          {questions.map((q, i) => {
            const result = results.find((r) => r.questionId === q.id);
            return (
              <div
                key={q.id}
                style={{
                  width: 10,
                  height: 10,
                  border: "2px solid #0D0D0D",
                  background:
                    i < currentIndex
                      ? result?.isCorrect
                        ? "#1DB954"
                        : "#FF3B3B"
                      : i === currentIndex
                      ? "#FFD60A"
                      : "#CCCCCC",
                }}
              />
            );
          })}
        </div>

        {/* Question */}
        <div
          className="p-8 mb-6"
          style={{
            border: "2.5px solid #0D0D0D",
            background: "#FFFFFF",
            boxShadow: "6px 6px 0 #0D0D0D",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 800,
              color: "#888",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Topic: {current.topic}
          </div>
          <h2
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.5,
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {current.question}
          </h2>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {current.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={answerState !== "idle"}
              style={{
                border: optionBorder(idx),
                background: optionBg(idx),
                color: optionTextColor(idx),
                boxShadow:
                  answerState === "idle"
                    ? "4px 4px 0 #0D0D0D"
                    : idx === current.correctIndex
                    ? "4px 4px 0 #1DB954"
                    : idx === selectedOption
                    ? "4px 4px 0 #FF3B3B"
                    : "none",
                padding: "16px 20px",
                textAlign: "left",
                cursor: answerState === "idle" ? "pointer" : "default",
                transition: "all 0.15s ease",
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 700,
                fontSize: "0.95rem",
                lineHeight: 1.4,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  border: "2px solid currentColor",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  flexShrink: 0,
                  fontWeight: 800,
                }}
              >
                {String.fromCharCode(65 + idx)}
              </span>
              {opt}
              {answerState !== "idle" && idx === current.correctIndex && (
                <CheckCircle size={18} className="ml-auto" />
              )}
              {answerState === "wrong" && idx === selectedOption && (
                <XCircle size={18} className="ml-auto" />
              )}
            </button>
          ))}
        </div>

        {/* Explanation (Brilliant-style) */}
        {showExplanation && (
          <div
            className="p-6 mb-6 animate-slide-in"
            style={{
              border: `2.5px solid ${answerState === "correct" ? "#1DB954" : "#FF3B3B"}`,
              background: answerState === "correct" ? "#F0FDF4" : "#FFF0F0",
              boxShadow: `4px 4px 0 ${answerState === "correct" ? "#1DB954" : "#FF3B3B"}`,
            }}
          >
            <div className="flex items-start gap-3">
              {answerState === "correct" ? (
                <CheckCircle size={22} color="#1DB954" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
              ) : (
                <AlertCircle size={22} color="#FF3B3B" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
              )}
              <div>
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: 800,
                    marginBottom: 6,
                    color: answerState === "correct" ? "#1DB954" : "#FF3B3B",
                  }}
                >
                  {answerState === "correct" ? "✓ Correct!" : `✗ You chose "${current.options[selectedOption!]}" — that's wrong.`}
                </div>
                <p style={{ fontSize: "0.92rem", fontWeight: 500, lineHeight: 1.7, color: "#333" }}>
                  {current.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Next / Results button */}
        {answerState !== "idle" && (
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="brutal-btn flex items-center gap-3 px-8 py-4 text-base"
              style={{ background: "#FFD60A" }}
            >
              {isLast ? "View My Results →" : "Next Question"}
              <ChevronRight size={20} />
            </button>
          </div>
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
