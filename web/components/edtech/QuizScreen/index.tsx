"use client";

import { useState, useEffect, useRef } from "react";
import {
  Trophy,
  AlertCircle,
  CheckCircle2,
  Clock,
  BookmarkPlus,
  ChevronLeft,
  ChevronRight,
  Send,
} from "lucide-react";
import { QUIZ_DATA } from "@/lib/edtech/quizData";
import { TopicScore } from "@/lib/edtech/conceptGraph";

interface QuizScreenProps {
  domain: string;
  onComplete: (scores: Record<string, TopicScore>, results: QuestionResult[]) => void;
  onBack: () => void;
}

export interface QuestionResult {
  questionId: string;
  topic: string;
  concept: string;
  isCorrect: boolean;
  timeSpent: number;
}

// Per-question state tracked during the exam
type QuestionStatus = "unattempted" | "attempted" | "marked" | "attempted-marked";

interface QuestionAttempt {
  selectedOption: number | null;
  status: QuestionStatus;
  timeSpent: number; // seconds accumulated
}

// ─── Colour helpers ────────────────────────────────────────────────────────────

function getStatusColor(status: QuestionStatus, isCurrent: boolean) {
  if (isCurrent)
    return {
      background: "#0D0D0D",
      color: "#FFD60A",
      border: "2.5px solid #FFD60A",
      boxShadow: "3px 3px 0 #FFD60A",
    };
  switch (status) {
    case "attempted":
      return {
        background: "#1DB954",
        color: "#fff",
        border: "2.5px solid #0D0D0D",
        boxShadow: "2px 2px 0 #0D0D0D",
      };
    case "marked":
      return {
        background: "#8B5CF6",
        color: "#fff",
        border: "2.5px solid #0D0D0D",
        boxShadow: "2px 2px 0 #0D0D0D",
      };
    case "attempted-marked":
      return {
        background: "#8B5CF6",
        color: "#FFD60A",
        border: "2.5px solid #0D0D0D",
        boxShadow: "2px 2px 0 #0D0D0D",
      };
    default:
      return {
        background: "#FFFFFF",
        color: "#0D0D0D",
        border: "2.5px solid #0D0D0D",
        boxShadow: "2px 2px 0 #0D0D0D",
      };
  }
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

// ─── Submitted review helpers ──────────────────────────────────────────────────

function getResultOptionStyle(
  idx: number,
  selectedOption: number | null,
  correctIndex: number
): React.CSSProperties {
  if (idx === correctIndex) {
    return {
      background: "linear-gradient(135deg,#1DB954 0%,#17a348 100%)",
      border: "3px solid #0D0D0D",
      color: "#000",
      boxShadow: "4px 4px 0 rgba(29,185,84,0.25)",
    };
  }
  if (idx === selectedOption && selectedOption !== correctIndex) {
    return {
      background: "linear-gradient(135deg,#FF3B3B 0%,#e63232 100%)",
      border: "3px solid #0D0D0D",
      color: "#fff",
      boxShadow: "4px 4px 0 rgba(255,59,59,0.25)",
    };
  }
  return {
    background: "#F0EEEA",
    border: "3px solid #CCCCCC",
    color: "rgba(13,13,13,0.35)",
    boxShadow: "none",
  };
}

function getResultLabelStyle(
  idx: number,
  selectedOption: number | null,
  correctIndex: number
): React.CSSProperties {
  if (idx === correctIndex) return { background: "#0D0D0D", color: "#1DB954" };
  if (idx === selectedOption && selectedOption !== correctIndex)
    return { background: "#0D0D0D", color: "#FF3B3B" };
  return { background: "#CCCCCC", color: "rgba(13,13,13,0.35)" };
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function QuizScreen({ domain, onComplete, onBack }: QuizScreenProps) {
  const questions = QUIZ_DATA[domain] || QUIZ_DATA["DSA"];
  const totalQuestions = questions.length;

  // Exam state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>(() =>
    questions.map(() => ({ selectedOption: null, status: "unattempted", timeSpent: 0 }))
  );
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Timer (per-question accumulator using a ref for the interval)
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartRef = useRef(Date.now());

  // Total elapsed time display
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);
  const elapsedTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    elapsedTimerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
    }, 1000);
    return () => {
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    };
  }, []);

  // When current question changes, save time spent on the previous question
  const saveTimeForCurrent = () => {
    const spent = Math.round((Date.now() - questionStartRef.current) / 1000);
    setAttempts((prev) => {
      const next = [...prev];
      next[currentIndex] = { ...next[currentIndex], timeSpent: next[currentIndex].timeSpent + spent };
      return next;
    });
    questionStartRef.current = Date.now();
  };

  const goToQuestion = (idx: number) => {
    saveTimeForCurrent();
    setCurrentIndex(idx);
  };

  // ── Option selection ──────────────────────────────────────────────────────────
  const handleSelect = (optIdx: number) => {
    if (submitted) return;
    setAttempts((prev) => {
      const next = [...prev];
      const cur = next[currentIndex];
      const newStatus: QuestionStatus =
        cur.status === "marked" || cur.status === "attempted-marked"
          ? "attempted-marked"
          : "attempted";
      next[currentIndex] = { ...cur, selectedOption: optIdx, status: newStatus };
      return next;
    });
  };

  // ── Mark for review ───────────────────────────────────────────────────────────
  const handleMarkForReview = () => {
    if (submitted) return;
    setAttempts((prev) => {
      const next = [...prev];
      const cur = next[currentIndex];
      const isAttempted = cur.selectedOption !== null;
      const isAlreadyMarked = cur.status === "marked" || cur.status === "attempted-marked";
      const newStatus: QuestionStatus = isAlreadyMarked
        ? isAttempted
          ? "attempted"
          : "unattempted"
        : isAttempted
        ? "attempted-marked"
        : "marked";
      next[currentIndex] = { ...cur, status: newStatus };
      return next;
    });
  };

  // ── Clear response ────────────────────────────────────────────────────────────
  const handleClear = () => {
    if (submitted) return;
    setAttempts((prev) => {
      const next = [...prev];
      const cur = next[currentIndex];
      const newStatus: QuestionStatus =
        cur.status === "attempted-marked" || cur.status === "marked" ? "marked" : "unattempted";
      next[currentIndex] = { ...cur, selectedOption: null, status: newStatus };
      return next;
    });
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    saveTimeForCurrent();
    if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);

    const results: QuestionResult[] = questions.map((q, i) => ({
      questionId: q.id,
      topic: q.topic,
      concept: q.concept,
      isCorrect: attempts[i].selectedOption === q.correctIndex,
      timeSpent: attempts[i].timeSpent,
    }));

    // Build scores per topic
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

    setSubmitted(true);
    setShowConfirm(false);
    // Scroll to top of question panel
    setCurrentIndex(0);

    // After a short review moment, hand off to parent
    // (We show a results summary inline before calling onComplete)
    onComplete(scores, results);
  };

  // ── Derived counts ─────────────────────────────────────────────────────────────
  const attemptedCount = attempts.filter(
    (a) => a.status === "attempted" || a.status === "attempted-marked"
  ).length;
  const markedCount = attempts.filter(
    (a) => a.status === "marked" || a.status === "attempted-marked"
  ).length;
  const unattemptedCount = attempts.filter((a) => a.status === "unattempted").length;

  const current = questions[currentIndex];
  const currentAttempt = attempts[currentIndex];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ─── RENDER ──────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F0E8",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <header
        style={{
          background: "#0D0D0D",
          borderBottom: "3px solid #FFD60A",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        {/* Left: exit + domain */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={onBack}
            style={{
              background: "transparent",
              border: "2px solid #FFD60A",
              color: "#FFD60A",
              padding: "5px 12px",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            ← Exit
          </button>
          <div
            style={{
              background: "#FFD60A",
              color: "#0D0D0D",
              padding: "4px 14px",
              fontWeight: 800,
              fontSize: "0.9rem",
              border: "2px solid #FFD60A",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {domain}
          </div>
          <span
            style={{
              fontSize: "0.75rem",
              color: "#aaa",
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            MCQ Exam &mdash; {totalQuestions} Questions
          </span>
        </div>

        {/* Center: progress counts */}
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <StatPill label="Answered" value={attemptedCount} color="#1DB954" />
          <StatPill label="Marked" value={markedCount} color="#8B5CF6" />
          <StatPill label="Not Visited" value={unattemptedCount} color="#888" />
        </div>

        {/* Right: timer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#FFD60A",
            fontWeight: 800,
            fontSize: "1.1rem",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.04em",
          }}
        >
          <Clock size={18} />
          {formatTime(elapsed)}
        </div>
      </header>

      {/* ── Body: two-panel layout ───────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* ── LEFT: Question + Options ─────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            borderRight: "3px solid #0D0D0D",
          }}
        >
          {/* Question number strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Question {currentIndex + 1} / {totalQuestions}
              </span>
              <span
                style={{
                  background: getTopicColor(current.topic),
                  border: "2px solid #0D0D0D",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  padding: "2px 8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {current.topic}
              </span>
            </div>

            {/* Mark for review toggle */}
            <button
              onClick={handleMarkForReview}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background:
                  currentAttempt.status === "marked" ||
                  currentAttempt.status === "attempted-marked"
                    ? "#8B5CF6"
                    : "transparent",
                border: "2px solid #8B5CF6",
                color:
                  currentAttempt.status === "marked" ||
                  currentAttempt.status === "attempted-marked"
                    ? "#fff"
                    : "#8B5CF6",
                padding: "4px 12px",
                fontWeight: 700,
                fontSize: "0.75rem",
                cursor: "pointer",
                letterSpacing: "0.04em",
                transition: "all 0.15s ease",
              }}
            >
              <BookmarkPlus size={14} />
              {currentAttempt.status === "marked" ||
              currentAttempt.status === "attempted-marked"
                ? "Marked"
                : "Mark for Review"}
            </button>
          </div>

          {/* Question card */}
          <div
            style={{
              border: "3px solid #0D0D0D",
              background: "#FFFFFF",
              boxShadow: "6px 6px 0 #0D0D0D",
              padding: "24px 28px",
            }}
          >
            <div
              style={{
                fontSize: "0.65rem",
                fontWeight: 800,
                color: "#999",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Q{currentIndex + 1}.
            </div>
            <p
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.6,
                fontFamily: "'JetBrains Mono', monospace",
                color: "#0D0D0D",
                margin: 0,
              }}
            >
              {current.question}
            </p>
          </div>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {current.options.map((opt, idx) => {
              const isSelected = currentAttempt.selectedOption === idx;
              const pendingStyle: React.CSSProperties = isSelected
                ? {
                    background: "#0D0D0D",
                    border: "3px solid #FFD60A",
                    color: "#FFD60A",
                    boxShadow: "4px 4px 0 #FFD60A",
                    cursor: "pointer",
                  }
                : {
                    background: "#FFFFFF",
                    border: "3px solid #0D0D0D",
                    color: "#0D0D0D",
                    boxShadow: "4px 4px 0 #0D0D0D",
                    cursor: "pointer",
                  };

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={submitted}
                  style={{
                    ...pendingStyle,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    textAlign: "left",
                    padding: "14px 18px",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    lineHeight: 1.4,
                    transition: "all 0.1s ease",
                  }}
                >
                  {/* Letter badge */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: 34,
                      height: 34,
                      border: "2px solid #0D0D0D",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      background: isSelected ? "#FFD60A" : "#0D0D0D",
                      color: isSelected ? "#0D0D0D" : "#FFD60A",
                    }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span style={{ flex: 1 }}>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Clear + navigation row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 8,
              gap: 12,
            }}
          >
            <button
              onClick={handleClear}
              disabled={submitted || currentAttempt.selectedOption === null}
              style={{
                background: "transparent",
                border: "2px solid #FF3B3B",
                color: "#FF3B3B",
                padding: "7px 16px",
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor:
                  submitted || currentAttempt.selectedOption === null
                    ? "not-allowed"
                    : "pointer",
                opacity: currentAttempt.selectedOption === null ? 0.4 : 1,
                letterSpacing: "0.04em",
              }}
            >
              Clear Response
            </button>

            <div style={{ display: "flex", gap: 10 }}>
              <NavBtn
                label="← Prev"
                icon={<ChevronLeft size={16} />}
                disabled={currentIndex === 0}
                onClick={() => goToQuestion(currentIndex - 1)}
              />
              <NavBtn
                label="Next →"
                icon={<ChevronRight size={16} />}
                iconRight
                disabled={currentIndex === totalQuestions - 1}
                onClick={() => goToQuestion(currentIndex + 1)}
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT: Question navigator + submit ──────────────────────────── */}
        <div
          style={{
            width: 280,
            flexShrink: 0,
            background: "#FFFFFF",
            borderLeft: "3px solid #0D0D0D",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Navigator header */}
          <div
            style={{
              background: "#0D0D0D",
              color: "#FFD60A",
              padding: "12px 16px",
              fontWeight: 800,
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderBottom: "3px solid #FFD60A",
              flexShrink: 0,
            }}
          >
            Question Navigator
          </div>

          {/* Legend */}
          <div
            style={{
              padding: "10px 14px",
              borderBottom: "2px solid #E8E8E0",
              display: "flex",
              flexDirection: "column",
              gap: 5,
              flexShrink: 0,
            }}
          >
            <LegendItem color="#FFD60A" borderColor="#FFD60A" label="Current" textColor="#0D0D0D" bg="#0D0D0D" />
            <LegendItem color="#1DB954" label="Answered" />
            <LegendItem color="#8B5CF6" label="Marked for Review" />
            <LegendItem color="#FFFFFF" label="Not Answered" />
          </div>

          {/* Number grid */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 8,
              }}
            >
              {questions.map((q, i) => {
                const s = getStatusColor(attempts[i].status, i === currentIndex);
                return (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(i)}
                    style={{
                      ...s,
                      width: "100%",
                      aspectRatio: "1",
                      fontWeight: 800,
                      fontSize: "0.78rem",
                      cursor: "pointer",
                      transition: "all 0.1s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit button */}
          <div
            style={{
              padding: "14px",
              borderTop: "3px solid #0D0D0D",
              flexShrink: 0,
            }}
          >
            {/* Summary before submit */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 6,
                marginBottom: 12,
              }}
            >
              <MiniStat label="Answered" value={attemptedCount} color="#1DB954" />
              <MiniStat label="Unattempted" value={unattemptedCount} color="#FF3B3B" />
            </div>

            <button
              onClick={() => setShowConfirm(true)}
              style={{
                width: "100%",
                background: "#0D0D0D",
                color: "#FFD60A",
                border: "3px solid #0D0D0D",
                boxShadow: "4px 4px 0 #FFD60A",
                padding: "13px",
                fontWeight: 800,
                fontSize: "0.9rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.1s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px,2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0 #FFD60A";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "4px 4px 0 #FFD60A";
              }}
            >
              <Send size={16} />
              Submit Test
            </button>
          </div>
        </div>
      </div>

      {/* ── Confirm submit modal ─────────────────────────────────────────────── */}
      {showConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(13,13,13,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={() => setShowConfirm(false)}
        >
          <div
            style={{
              background: "#FFFFFF",
              border: "4px solid #0D0D0D",
              boxShadow: "10px 10px 0 #FFD60A",
              padding: "36px 40px",
              maxWidth: 420,
              width: "90vw",
              animation: "pop-in 0.25s ease forwards",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 18,
              }}
            >
              <AlertCircle size={28} color="#FF3B3B" strokeWidth={2.5} />
              <h2
                style={{
                  fontWeight: 800,
                  fontSize: "1.3rem",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                Submit Test?
              </h2>
            </div>

            <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "#444", marginBottom: 20 }}>
              You are about to submit your exam. This action cannot be undone.
            </p>

            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
                marginBottom: 24,
              }}
            >
              <ConfirmStat label="Answered" value={attemptedCount} color="#1DB954" />
              <ConfirmStat label="Marked" value={markedCount} color="#8B5CF6" />
              <ConfirmStat label="Unattempted" value={unattemptedCount} color="#FF3B3B" />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1,
                  background: "#F5F0E8",
                  border: "3px solid #0D0D0D",
                  boxShadow: "3px 3px 0 #0D0D0D",
                  padding: "11px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  flex: 1,
                  background: "#0D0D0D",
                  border: "3px solid #0D0D0D",
                  boxShadow: "3px 3px 0 #FFD60A",
                  color: "#FFD60A",
                  padding: "11px",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Trophy size={16} />
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Small sub-components ──────────────────────────────────────────────────────

function StatPill({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div
        style={{
          width: 10,
          height: 10,
          background: color,
          border: "1.5px solid #fff",
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: "0.75rem", color: "#ccc", fontWeight: 600 }}>
        {label}: <strong style={{ color: "#fff" }}>{value}</strong>
      </span>
    </div>
  );
}

function LegendItem({
  color,
  label,
  borderColor,
  textColor,
  bg,
}: {
  color: string;
  label: string;
  borderColor?: string;
  textColor?: string;
  bg?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 20,
          height: 20,
          background: bg || color,
          border: `2px solid ${borderColor || "#0D0D0D"}`,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {bg && (
          <div
            style={{ width: 10, height: 10, background: color, borderRadius: 0 }}
          />
        )}
      </div>
      <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#555" }}>{label}</span>
    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      style={{
        border: `2px solid ${color}`,
        padding: "6px 8px",
        textAlign: "center",
      }}
    >
      <div style={{ fontWeight: 800, fontSize: "1.1rem", color }}>{value}</div>
      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </div>
    </div>
  );
}

function ConfirmStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      style={{
        border: `2.5px solid ${color}`,
        background: `${color}18`,
        padding: "10px 6px",
        textAlign: "center",
      }}
    >
      <div style={{ fontWeight: 800, fontSize: "1.4rem", color }}>{value}</div>
      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </div>
    </div>
  );
}

function NavBtn({
  label,
  icon,
  iconRight,
  disabled,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  iconRight?: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? "#E8E8E0" : "#0D0D0D",
        color: disabled ? "#aaa" : "#FFD60A",
        border: "2.5px solid #0D0D0D",
        boxShadow: disabled ? "none" : "3px 3px 0 #0D0D0D",
        padding: "8px 16px",
        fontWeight: 700,
        fontSize: "0.8rem",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
        letterSpacing: "0.02em",
        transition: "all 0.1s ease",
      }}
    >
      {!iconRight && icon}
      {label}
      {iconRight && icon}
    </button>
  );
}
