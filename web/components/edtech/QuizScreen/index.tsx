"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Trophy,
  AlertCircle,
  Clock,
  BookmarkPlus,
  ChevronLeft,
  ChevronRight,
  Send,
  Lightbulb,
  Lock,
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

function getKidOptionStyle(
  idx: number,
  isSelected: boolean,
  submitted: boolean,
  selectedOption: number | null,
  correctIndex: number
): React.CSSProperties {
  if (!submitted) {
    return {
      background: isSelected ? "#DCFCE7" : "#FFFFFF",
      border: `3px solid ${isSelected ? "#22C55E" : "#0D0D0D"}`,
      color: "#0D0D0D",
      boxShadow: isSelected ? "4px 4px 0 #22C55E" : "4px 4px 0 #0D0D0D",
      cursor: "pointer",
      transform: isSelected ? "translate(2px, 2px)" : "none",
    };
  }

  if (idx === correctIndex) {
    return {
      background: "#DCFCE7",
      border: "3px solid #16A34A",
      color: "#0D0D0D",
      boxShadow: "4px 4px 0 #16A34A",
      cursor: "default",
    };
  }

  if (idx === selectedOption && selectedOption !== correctIndex) {
    return {
      background: "#FEE2E2",
      border: "3px solid #EF4444",
      color: "#0D0D0D",
      boxShadow: "4px 4px 0 #EF4444",
      cursor: "default",
    };
  }

  return {
    background: "#FFFFFF",
    border: "3px solid #D4D4D4",
    color: "#777",
    boxShadow: "none",
    cursor: "default",
  };
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function QuizScreen({ domain, onComplete, onBack }: QuizScreenProps) {
  // Enhanced fallback logic: Try exact match, then subject-only match, then default to DSA
  const getQuestions = () => {
    if (QUIZ_DATA[domain]) return QUIZ_DATA[domain];
    
    // Extract base subject (e.g. "Physics" from "Physics (11th Grade)")
    const baseSubject = domain.split(" (")[0];
    if (QUIZ_DATA[baseSubject]) return QUIZ_DATA[baseSubject];

    // Check for nested keys (e.g. "Mathematics" matches "Mathematics (11th Grade)")
    const fuzzyKey = Object.keys(QUIZ_DATA).find(k => k.startsWith(baseSubject));
    if (fuzzyKey) return QUIZ_DATA[fuzzyKey];

    return QUIZ_DATA["DSA"];
  };

  const questions = getQuestions();
  const totalQuestions = questions.length;
  const isVisualKidQuiz = questions.some((question) => question.cardStyle === "visual");
  const showExamChrome = !isVisualKidQuiz;

  // Exam state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>(() =>
    questions.map(() => ({ selectedOption: null, status: "unattempted", timeSpent: 0 }))
  );
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Hints state
  const MAX_HINTS = 3;
  const [setupDone, setSetupDone] = useState(false);
  const [hintsEnabled, setHintsEnabled] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintShown, setHintShown] = useState<Record<number, boolean>>({});

  // Timer (per-question accumulator using a ref for the interval)
  const questionStartRef = useRef(0);

  // Total elapsed time display
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);
  const elapsedTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    questionStartRef.current = Date.now();
  }, []);

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

  // ── Use hint ──────────────────────────────────────────────────
  const handleUseHint = () => {
    if (!hintsEnabled || hintsUsed >= MAX_HINTS || hintShown[currentIndex]) return;
    setHintShown((prev) => ({ ...prev, [currentIndex]: true }));
    setHintsUsed((prev) => prev + 1);
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
  const visualPalette = ["#FFD60A", "#5AC8FA", "#FF8A65", "#7EE787"];
  const optionLayoutStyle: React.CSSProperties = isVisualKidQuiz
    ? {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 16,
      }
    : {
        display: "flex",
        flexDirection: "column",
        gap: 12,
      };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
    .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ─── RENDER ───────────────────  // ─── Pre-quiz Hints Setup Screen ───────────────────────────────────────

  if (!setupDone) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#F5F0E8",
          backgroundImage: "radial-gradient(circle, #00000012 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Space Grotesk', sans-serif",
          padding: "20px",
        }}
      >
        <div style={{ maxWidth: 500, width: "100%" }}>
          {/* Header panel */}
          <div
            style={{
              background: "#0D0D0D",
              padding: "20px 28px",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                background: "#FFD60A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Trophy size={24} color="#0D0D0D" />
            </div>
            <div>
              <div
                style={{
                  color: "#FFD60A",
                  fontWeight: 900,
                  fontSize: "0.68rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                {domain} · {totalQuestions} Questions
              </div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Before You Begin
              </div>
            </div>
          </div>

          {/* Body panel */}
          <div
            style={{
              background: "#fff",
              border: "4px solid #0D0D0D",
              borderTop: "none",
              boxShadow: "8px 8px 0 #0D0D0D",
              padding: "28px",
            }}
          >
            {/* Hint info box */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                background: "#FFFBEB",
                border: "2.5px solid #F59E0B",
                padding: "16px 18px",
                marginBottom: 24,
              }}
            >
              <Lightbulb size={20} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "#0D0D0D", marginBottom: 4 }}>
                  Hint System Available
                </div>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#666", lineHeight: 1.6 }}>
                  {isVisualKidQuiz
                    ? "This round is built for little learners with big picture cards and simple taps. Hints are optional and can gently help if needed."
                    : <>Use up to <strong>3 hints</strong> during the exam. Each hint reveals a concept nudge for that question. Once used, a hint cannot be undone.</>}
                </div>
              </div>
            </div>

            {/* Mode label */}
            <p
              style={{
                fontWeight: 700,
                fontSize: "0.72rem",
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 12,
              }}
            >
              Choose your challenge mode:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Enable hints */}
              <button
                onClick={() => { setHintsEnabled(true); setSetupDone(true); }}
                style={{
                  width: "100%",
                  background: "#FFD60A",
                  border: "3px solid #0D0D0D",
                  boxShadow: "5px 5px 0 #0D0D0D",
                  padding: "15px 18px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  textAlign: "left",
                  transition: "all 0.1s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translate(3px,3px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0 #0D0D0D";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "5px 5px 0 #0D0D0D";
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    background: "#0D0D0D",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Lightbulb size={21} color="#FFD60A" />
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: "0.95rem", color: "#0D0D0D", letterSpacing: "-0.01em" }}>
                    Enable Hints
                  </div>
                  <div style={{ fontWeight: 600, fontSize: "0.72rem", color: "#555", marginTop: 2 }}>
                    Up to 3 hints · Adaptive challenge
                  </div>
                </div>
              </button>

              {/* No hints — exam mode */}
              <button
                onClick={() => { setHintsEnabled(false); setSetupDone(true); }}
                style={{
                  width: "100%",
                  background: "#0D0D0D",
                  border: "3px solid #0D0D0D",
                  boxShadow: "5px 5px 0 #FFD60A",
                  padding: "15px 18px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  textAlign: "left",
                  transition: "all 0.1s ease",
                  color: "#FFD60A",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translate(3px,3px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0 #FFD60A";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "5px 5px 0 #FFD60A";
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    background: "#FFD60A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Lock size={21} color="#0D0D0D" />
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: "0.95rem", letterSpacing: "-0.01em" }}>
                    No Hints — Exam Mode 🔒
                  </div>
                  <div style={{ fontWeight: 600, fontSize: "0.72rem", color: "#aaa", marginTop: 2 }}>
                    Pure challenge · No assists
                  </div>
                </div>
              </button>
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
                marginTop: 22,
                paddingTop: 18,
                borderTop: "2px solid #E8E8E0",
              }}
            >
              <div style={{ border: "2px solid #0D0D0D", padding: "10px 6px", textAlign: "center" }}>
                <div style={{ fontWeight: 900, fontSize: "1.2rem", color: "#0D0D0D" }}>{totalQuestions}</div>
                <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em" }}>Questions</div>
              </div>
              <div style={{ border: "2px solid #0D0D0D", padding: "10px 6px", textAlign: "center", background: "#0D0D0D" }}>
                <div style={{ fontWeight: 900, fontSize: "1.2rem", color: "#FFD60A" }}>3</div>
                <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em" }}>Max Hints</div>
              </div>
              <div style={{ border: "2px solid #0D0D0D", padding: "10px 6px", textAlign: "center" }}>
                <div style={{ fontWeight: 900, fontSize: "1.2rem", color: "#0D0D0D" }}>MCQ</div>
                <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em" }}>Format</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── RENDER ────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F5F0E8",
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
          padding: isVisualKidQuiz ? "12px 18px" : "10px 20px",
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
            {isVisualKidQuiz ? `Question ${currentIndex + 1} of ${totalQuestions}` : `MCQ Exam — ${totalQuestions} Questions`}
          </span>
        </div>

        {showExamChrome ? (
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <StatPill label="Answered" value={attemptedCount} color="#1DB954" />
            <StatPill label="Marked" value={markedCount} color="#8B5CF6" />
            <StatPill label="Not Visited" value={unattemptedCount} color="#888" />
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {questions.map((q, i) => (
              <div
                key={q.id}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  border: "2px solid #FFD60A",
                  background:
                    i < currentIndex
                      ? "#34C759"
                      : i === currentIndex
                      ? "#FFD60A"
                      : "transparent",
                }}
              />
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {hintsEnabled && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: hintsUsed >= MAX_HINTS ? "rgba(255,59,59,0.15)" : "rgba(255,214,10,0.15)",
                border: `1.5px solid ${hintsUsed >= MAX_HINTS ? "#FF3B3B" : "#FFD60A"}`,
                padding: "4px 10px",
              }}
            >
              <Lightbulb size={13} color={hintsUsed >= MAX_HINTS ? "#FF3B3B" : "#FFD60A"} />
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  color: hintsUsed >= MAX_HINTS ? "#FF3B3B" : "#FFD60A",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {MAX_HINTS - hintsUsed} hint{MAX_HINTS - hintsUsed !== 1 ? "s" : ""} left
              </span>
            </div>
          )}
          {showExamChrome && (
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
          )}
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
          borderRight: showExamChrome ? "3px solid #0D0D0D" : "none",
          maxWidth: isVisualKidQuiz ? 980 : undefined,
          margin: isVisualKidQuiz ? "0 auto" : undefined,
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
              {showExamChrome && (
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
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Hint button */}
              {showExamChrome && hintsEnabled && (
                <button
                  onClick={handleUseHint}
                  disabled={submitted || hintsUsed >= MAX_HINTS || hintShown[currentIndex]}
                  title={
                    hintShown[currentIndex]
                      ? "Hint already revealed"
                      : hintsUsed >= MAX_HINTS
                      ? "No hints remaining"
                      : `Use a hint (${MAX_HINTS - hintsUsed} left)`
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: hintShown[currentIndex]
                      ? "rgba(29,185,84,0.12)"
                      : hintsUsed >= MAX_HINTS
                      ? "#F5F0E8"
                      : "#FFFBEB",
                    border: `2px solid ${
                      hintShown[currentIndex]
                        ? "#1DB954"
                        : hintsUsed >= MAX_HINTS
                        ? "#CCC"
                        : "#F59E0B"
                    }`,
                    color: hintShown[currentIndex]
                      ? "#1DB954"
                      : hintsUsed >= MAX_HINTS
                      ? "#AAA"
                      : "#92400E",
                    padding: "4px 10px",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    cursor:
                      submitted || hintsUsed >= MAX_HINTS || hintShown[currentIndex]
                        ? "not-allowed"
                        : "pointer",
                    letterSpacing: "0.04em",
                    opacity: hintsUsed >= MAX_HINTS && !hintShown[currentIndex] ? 0.5 : 1,
                    transition: "all 0.15s ease",
                  }}
                >
                  <Lightbulb size={13} />
                  {hintShown[currentIndex]
                    ? "Hint Used ✓"
                    : `Hint (${MAX_HINTS - hintsUsed} left)`}
                </button>
              )}

              {/* Mark for review toggle */}
              {showExamChrome && (
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
              )}
            </div>
          </div>

          {/* Question card */}
          <div
            style={{
              border: "3px solid #0D0D0D",
              background: isVisualKidQuiz
                ? "linear-gradient(135deg, #FFFDF6 0%, #F7F1FF 48%, #EAF7FF 100%)"
                : "#FFFFFF",
              boxShadow: "6px 6px 0 #0D0D0D",
              padding: isVisualKidQuiz ? "28px" : "24px 28px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {isVisualKidQuiz && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at top left, rgba(255,214,10,0.22), transparent 28%), radial-gradient(circle at bottom right, rgba(90,200,250,0.24), transparent 30%)",
                  pointerEvents: "none",
                }}
              />
            )}
            <div style={{ position: "relative", zIndex: 1 }}>
              {!isVisualKidQuiz && (
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
              )}
              {isVisualKidQuiz && current.promptVisual && (
                <div
                  style={{
                    minHeight: 120,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                    border: "3px solid #0D0D0D",
                    background: "#FFFFFF",
                    boxShadow: "5px 5px 0 rgba(13,13,13,0.12)",
                    fontSize: "clamp(2.6rem, 8vw, 4.4rem)",
                    lineHeight: 1.1,
                    textAlign: "center",
                    padding: "14px 18px",
                    borderRadius: 28,
                  }}
                >
                  {current.promptVisual}
                </div>
              )}
              {isVisualKidQuiz && current.promptImageSrc && (
                <div
                  style={{
                    minHeight: 140,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                    border: "3px solid #0D0D0D",
                    background: "#FFFFFF",
                    boxShadow: "5px 5px 0 rgba(13,13,13,0.12)",
                    padding: "10px 14px",
                    borderRadius: 28,
                  }}
                >
                  <Image
                    src={current.promptImageSrc}
                    alt={current.promptImageAlt ?? current.question}
                    width={360}
                    height={180}
                    style={{
                      width: "min(100%, 360px)",
                      height: "auto",
                      display: "block",
                    }}
                  />
                </div>
              )}
              <p
                style={{
                  fontSize: isVisualKidQuiz ? "clamp(1.2rem, 3vw, 1.6rem)" : "1.1rem",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: isVisualKidQuiz ? 1.35 : 1.6,
                  fontFamily: isVisualKidQuiz ? "'Space Grotesk', sans-serif" : "'JetBrains Mono', monospace",
                  color: "#0D0D0D",
                  margin: 0,
                  textAlign: isVisualKidQuiz ? "center" : "left",
                }}
              >
                {current.question}
              </p>
            </div>
          </div>

          {/* Hint reveal panel */}
          {hintsEnabled && hintShown[currentIndex] && (
            <div
              style={{
                border: "2.5px solid #F59E0B",
                background: "#FFFBEB",
                padding: "14px 18px",
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                animation: "pop-in 0.2s ease forwards",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 30,
                  height: 30,
                  background: "#FDE68A",
                  border: "2px solid #F59E0B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Lightbulb size={15} color="#D97706" />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    color: "#D97706",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 5,
                  }}
                >
                  Hint — {current.concept}
                </div>
                <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#555", lineHeight: 1.6, margin: 0 }}>
                  {current.explanation}
                </p>
              </div>
            </div>
          )}

          {/* Options */}
          <div style={optionLayoutStyle}>
            {current.options.map((opt, idx) => {
              const isSelected = currentAttempt.selectedOption === idx;
              const optionAccent = visualPalette[idx % visualPalette.length];
              const pendingStyle: React.CSSProperties = isVisualKidQuiz
                ? getKidOptionStyle(
                    idx,
                    isSelected,
                    submitted,
                    currentAttempt.selectedOption,
                    current.correctIndex
                  )
                : isSelected
                  ? {
                      background: "#0D0D0D",
                      border: "3px solid #FFD60A",
                      color: "#FFD60A",
                      boxShadow: "4px 4px 0 #FFD60A",
                      cursor: "pointer",
                      transform: "translate(2px, 2px)",
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
                    alignItems: isVisualKidQuiz ? "stretch" : "center",
                    gap: 14,
                    textAlign: "left",
                    padding: isVisualKidQuiz ? "18px 16px" : "14px 18px",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: isVisualKidQuiz ? "1rem" : "0.95rem",
                    lineHeight: 1.4,
                    transition: "all 0.1s ease",
                    flexDirection: isVisualKidQuiz ? "column" : "row",
                    minHeight: isVisualKidQuiz ? 170 : undefined,
                    justifyContent: isVisualKidQuiz ? "space-between" : undefined,
                    borderRadius: isVisualKidQuiz ? 22 : 0,
                  }}
                >
                  {isVisualKidQuiz ? (
                    <>
                      <div
                        style={{
                          minHeight: 88,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: typeof current.optionVisuals?.[idx] === "string" && current.optionVisuals[idx].length <= 2 ? "4rem" : "3rem",
                          lineHeight: 1,
                          width: "100%",
                          border: "3px solid #0D0D0D",
                          background: submitted
                            ? idx === current.correctIndex
                              ? "#BBF7D0"
                              : idx === currentAttempt.selectedOption
                              ? "#FECACA"
                              : "#F8F8F8"
                            : isSelected
                            ? "#DCFCE7"
                            : optionAccent,
                          borderRadius: 24,
                          color: "#0D0D0D",
                          fontWeight: 900,
                        }}
                      >
                        {current.optionVisuals?.[idx] ?? "✨"}
                      </div>
                      {!(
                        typeof current.optionVisuals?.[idx] === "string" &&
                        current.optionVisuals[idx] === opt
                      ) && (
                        <span style={{ flex: 1, width: "100%", textAlign: "center", fontSize: "0.98rem", fontWeight: 800 }}>
                          {opt}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
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
            {showExamChrome ? (
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
            ) : (
              <div />
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <NavBtn
                label="← Prev"
                icon={<ChevronLeft size={16} />}
                disabled={currentIndex === 0}
                onClick={() => goToQuestion(currentIndex - 1)}
              />
              <NavBtn
                label={isVisualKidQuiz && currentIndex === totalQuestions - 1 ? "Finish Quiz" : "Next →"}
                icon={<ChevronRight size={16} />}
                iconRight
                disabled={!isVisualKidQuiz && currentIndex === totalQuestions - 1}
                onClick={() => {
                  if (isVisualKidQuiz && currentIndex === totalQuestions - 1) {
                    setShowConfirm(true);
                    return;
                  }
                  if (currentIndex < totalQuestions - 1) {
                    goToQuestion(currentIndex + 1);
                  }
                }}
              />
            </div>
          </div>

          {!showExamChrome && (
            <div
              style={{
                marginTop: 8,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => setShowConfirm(true)}
                style={{
                  background: "#0D0D0D",
                  color: "#FFD60A",
                  border: "3px solid #0D0D0D",
                  boxShadow: "4px 4px 0 #FFD60A",
                  padding: "14px 22px",
                  fontWeight: 800,
                  fontSize: "0.92rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Send size={16} />
                Finish Quiz
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT: Question navigator + submit ──────────────────────────── */}
        {showExamChrome && (
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
            <LegendItem color="#FFD60A" borderColor="#FFD60A" label="Current" bg="#0D0D0D" />
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
        )}
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
                  backgroundColor: "#F5F0E8",
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
  bg,
}: {
  color: string;
  label: string;
  borderColor?: string;
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
