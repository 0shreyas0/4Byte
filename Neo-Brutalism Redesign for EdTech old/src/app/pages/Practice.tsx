import { useState, useCallback } from "react";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Zap,
  Clock,
  Target,
  ChevronRight,
} from "lucide-react";

interface Question {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const questions: Question[] = [
  {
    id: 1,
    topic: "Functions",
    question: "Which of the following best describes a function?",
    options: [
      "A relation where every output has exactly one input",
      "A relation where every input has exactly one output",
      "A relation where inputs and outputs are always equal",
      "A relation with no repeated values",
    ],
    correctIndex: 1,
    explanation: "A function is a relation where every input (domain value) maps to exactly one output (range value). One input → one output.",
    difficulty: "Easy",
  },
  {
    id: 2,
    topic: "Differentiation",
    question: "What is the derivative of f(x) = x³ + 4x² - 2x + 7?",
    options: [
      "3x² + 8x - 2",
      "3x² + 4x - 2",
      "x² + 8x - 2",
      "3x³ + 8x - 2",
    ],
    correctIndex: 0,
    explanation: "Using the power rule: d/dx(xⁿ) = nxⁿ⁻¹. So d/dx(x³) = 3x², d/dx(4x²) = 8x, d/dx(-2x) = -2, d/dx(7) = 0.",
    difficulty: "Medium",
  },
  {
    id: 3,
    topic: "Limits",
    question: "What is lim(x→2) of (x² - 4) / (x - 2)?",
    options: ["0", "2", "4", "Undefined"],
    correctIndex: 2,
    explanation: "Factor the numerator: (x² - 4) = (x+2)(x-2). Cancel (x-2) to get lim(x→2) of (x+2) = 2+2 = 4.",
    difficulty: "Medium",
  },
  {
    id: 4,
    topic: "Trigonometry",
    question: "What is the value of sin(30°)?",
    options: ["√3/2", "1/2", "1/√2", "√3"],
    correctIndex: 1,
    explanation: "sin(30°) = 1/2. This is a standard trigonometric value from the unit circle.",
    difficulty: "Easy",
  },
  {
    id: 5,
    topic: "Algebra",
    question: "Solve for x: 2x² - 8 = 0",
    options: ["x = ±4", "x = ±2", "x = ±√8", "x = 4"],
    correctIndex: 1,
    explanation: "2x² = 8 → x² = 4 → x = ±√4 = ±2.",
    difficulty: "Easy",
  },
  {
    id: 6,
    topic: "Integration",
    question: "What is ∫(3x² + 2x) dx?",
    options: [
      "x³ + x² + C",
      "6x + 2 + C",
      "x³ + 2x² + C",
      "3x³ + x² + C",
    ],
    correctIndex: 0,
    explanation: "Using the power rule for integration: ∫xⁿ dx = xⁿ⁺¹/(n+1). So ∫3x² dx = x³ and ∫2x dx = x². Result: x³ + x² + C.",
    difficulty: "Medium",
  },
  {
    id: 7,
    topic: "Probability",
    question: "A bag has 3 red and 5 blue balls. What is P(red)?",
    options: ["3/8", "5/8", "3/5", "1/3"],
    correctIndex: 0,
    explanation: "Total balls = 3 + 5 = 8. P(red) = 3/8.",
    difficulty: "Easy",
  },
  {
    id: 8,
    topic: "Differentiation",
    question: "Find the critical point of f(x) = x² - 6x + 9.",
    options: ["x = 3", "x = -3", "x = 6", "x = 0"],
    correctIndex: 0,
    explanation: "f'(x) = 2x - 6. Setting f'(x) = 0: 2x - 6 = 0 → x = 3. This is the only critical point.",
    difficulty: "Hard",
  },
];

const diffColor: Record<string, string> = {
  Easy: "#34C759",
  Medium: "#FFD60A",
  Hard: "#FF3B30",
};

type AnswerState = "idle" | "correct" | "wrong";

export function Practice() {
  const [mode, setMode] = useState<"select" | "quiz" | "result">("select");
  const [selectedTopic, setSelectedTopic] = useState<string>("All Topics");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const topics = ["All Topics", ...Array.from(new Set(questions.map(q => q.topic)))];

  const filteredQuestions = selectedTopic === "All Topics"
    ? questions
    : questions.filter(q => q.topic === selectedTopic);

  const currentQ = filteredQuestions[currentIndex];
  const totalQ = filteredQuestions.length;
  const isLastQuestion = currentIndex === totalQ - 1;

  const handleAnswer = useCallback((optionIdx: number) => {
    if (answerState !== "idle") return;
    const isCorrect = optionIdx === currentQ.correctIndex;
    setSelectedOption(optionIdx);
    setAnswerState(isCorrect ? "correct" : "wrong");
    setAnswers(prev => {
      const next = [...prev];
      next[currentIndex] = optionIdx;
      return next;
    });
    if (!isCorrect) {
      setShakeKey(k => k + 1);
    }
    setTimeout(() => setShowExplanation(true), 300);
  }, [answerState, currentQ, currentIndex]);

  const handleNext = () => {
    if (isLastQuestion) {
      setMode("result");
    } else {
      setCurrentIndex(i => i + 1);
      setAnswerState("idle");
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setMode("select");
    setCurrentIndex(0);
    setAnswers([]);
    setAnswerState("idle");
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const correctCount = answers.filter((a, i) => a === filteredQuestions[i]?.correctIndex).length;
  const scorePercent = Math.round((correctCount / totalQ) * 100);

  if (mode === "select") {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-black text-black text-2xl md:text-3xl uppercase tracking-tight mb-1">
            ⚡ Practice Zone
          </h1>
          <p className="font-bold text-black/60 text-sm">
            Choose a topic and test your knowledge
          </p>
        </div>

        {/* Topic selector */}
        <div className="bg-white border-4 border-black p-5 shadow-[8px_8px_0px_black] mb-6">
          <h2 className="font-black text-black text-sm uppercase tracking-wide mb-4">
            📚 Select Topic
          </h2>
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-4 py-2 border-3 border-black font-black text-sm uppercase tracking-wide transition-all duration-100
                  ${selectedTopic === t
                    ? "bg-black text-white shadow-none translate-x-0.5 translate-y-0.5"
                    : "bg-[#FFD60A] text-black shadow-[4px_4px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Question preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {filteredQuestions.map((q, i) => (
            <div
              key={q.id}
              className="bg-white border-3 border-black p-4 flex items-start gap-3 shadow-[4px_4px_0px_black]"
            >
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[10px] font-black px-2 py-0.5 border-2 border-black uppercase"
                    style={{
                      backgroundColor: diffColor[q.difficulty],
                      color: q.difficulty === "Easy" || q.difficulty === "Medium" ? "#000" : "#fff",
                    }}
                  >
                    {q.difficulty}
                  </span>
                  <span className="text-[10px] font-bold text-black/50 uppercase">{q.topic}</span>
                </div>
                <p className="font-bold text-black text-sm leading-tight line-clamp-2">{q.question}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Start */}
        <div className="bg-black border-4 border-black p-5 shadow-[8px_8px_0px_#FFD60A]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="font-black text-[#FFD60A] text-lg uppercase">
                {filteredQuestions.length} Questions Ready
              </div>
              <div className="text-white/70 font-bold text-sm">
                Topic: {selectedTopic}
              </div>
            </div>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setAnswers([]);
                setMode("quiz");
              }}
              className="bg-[#FFD60A] border-3 border-[#FFD60A] px-8 py-4 font-black text-black text-sm uppercase tracking-wide shadow-[5px_5px_0px_white] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
            >
              <Zap className="w-5 h-5" /> Start Quiz ➜
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "result") {
    const grade = scorePercent >= 80 ? "Excellent! 🏆" : scorePercent >= 60 ? "Good Job! 👍" : "Keep Practicing! 💪";
    const gradeColor = scorePercent >= 80 ? "#34C759" : scorePercent >= 60 ? "#FFD60A" : "#FF3B30";

    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <div
          style={{ backgroundColor: gradeColor, boxShadow: "8px 8px 0px black" }}
          className="border-4 border-black p-6 text-center mb-6 pop-in"
        >
          <div className="text-5xl mb-3">
            {scorePercent >= 80 ? "🏆" : scorePercent >= 60 ? "👍" : "💪"}
          </div>
          <h1 className="font-black text-black text-3xl uppercase mb-1">{grade}</h1>
          <div className="font-black text-black text-6xl my-4">{scorePercent}%</div>
          <div className="font-bold text-black/70 text-sm">
            {correctCount} / {totalQ} correct answers
          </div>
        </div>

        {/* Per-question breakdown */}
        <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_black] mb-6">
          <h2 className="font-black text-black text-sm uppercase tracking-wide mb-4">
            📋 Question Breakdown
          </h2>
          <div className="space-y-2">
            {filteredQuestions.map((q, i) => {
              const isCorrect = answers[i] === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className="flex items-start gap-3 border-3 border-black p-3"
                  style={{ backgroundColor: isCorrect ? "#f0fff4" : "#fff5f5" }}
                >
                  <div
                    className="w-7 h-7 border-2 border-black flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: isCorrect ? "#34C759" : "#FF3B30" }}
                  >
                    {isCorrect
                      ? <CheckCircle2 className="w-4 h-4 text-white" />
                      : <XCircle className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-black text-sm leading-tight">{q.question}</p>
                    {!isCorrect && answers[i] !== null && (
                      <p className="text-[#FF3B30] font-bold text-xs mt-0.5">
                        Your answer: {q.options[answers[i]!]}
                      </p>
                    )}
                    {!isCorrect && (
                      <p className="text-[#34C759] font-bold text-xs">
                        Correct: {q.options[q.correctIndex]}
                      </p>
                    )}
                  </div>
                  <span
                    className="font-black text-xs px-2 py-0.5 border-2 border-black uppercase flex-shrink-0"
                    style={{
                      backgroundColor: diffColor[q.difficulty],
                      color: q.difficulty === "Hard" ? "#fff" : "#000",
                    }}
                  >
                    {q.difficulty}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRestart}
            className="flex-1 bg-[#FFD60A] border-3 border-black py-4 font-black text-black text-sm uppercase tracking-wide shadow-[5px_5px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <button
            onClick={() => setMode("select")}
            className="flex-1 bg-black border-3 border-black py-4 font-black text-white text-sm uppercase tracking-wide shadow-[5px_5px_0px_#34C759] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <Target className="w-4 h-4" /> New Topic
          </button>
        </div>
      </div>
    );
  }

  // Quiz mode
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="font-black text-black text-xs uppercase tracking-widest">
            Question {currentIndex + 1} of {totalQ}
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-black px-2 py-0.5 border-2 border-black uppercase"
              style={{
                backgroundColor: diffColor[currentQ.difficulty],
                color: currentQ.difficulty === "Hard" ? "#fff" : "#000",
              }}
            >
              {currentQ.difficulty}
            </span>
            <span className="text-xs font-bold text-black/50 uppercase">{currentQ.topic}</span>
          </div>
        </div>
        <div className="h-5 bg-[#F0F0F0] border-3 border-black relative overflow-hidden">
          <div
            className="h-full bg-black border-r-3 border-black transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / totalQ) * 100}%` }}
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-black text-white mix-blend-difference">
            {Math.round(((currentIndex + 1) / totalQ) * 100)}%
          </span>
        </div>
      </div>

      {/* Question */}
      <div
        className="bg-white border-4 border-black p-5 shadow-[8px_8px_0px_black] mb-4"
        key={`question-${currentQ.id}`}
      >
        <div className="font-black text-black text-lg leading-snug mb-1">
          Q{currentIndex + 1}.
        </div>
        <p className="font-bold text-black text-base leading-relaxed">{currentQ.question}</p>
      </div>

      {/* Options */}
      <div
        key={`options-${currentQ.id}-${shakeKey}`}
        className={`space-y-3 mb-4 ${answerState === "wrong" ? "shake" : ""}`}
      >
        {currentQ.options.map((opt, i) => {
          let bg = "bg-white";
          let border = "border-black";
          let shadow = "shadow-[4px_4px_0px_black]";
          let textColor = "text-black";
          let cursor = "cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none";

          if (answerState !== "idle") {
            cursor = "cursor-default";
            shadow = "shadow-none";
            if (i === currentQ.correctIndex) {
              bg = "bg-[#34C759]";
              textColor = "text-black";
            } else if (i === selectedOption && selectedOption !== currentQ.correctIndex) {
              bg = "bg-[#FF3B30]";
              textColor = "text-white";
            } else {
              bg = "bg-[#F0F0F0]";
              textColor = "text-black/40";
              border = "border-black/30";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={answerState !== "idle"}
              className={`w-full flex items-center gap-4 border-3 ${border} ${bg} p-4 ${shadow} ${cursor} transition-all duration-100 text-left`}
            >
              <div
                className={`w-8 h-8 flex-shrink-0 border-2 border-black flex items-center justify-center font-black text-sm
                  ${answerState !== "idle"
                    ? i === currentQ.correctIndex
                      ? "bg-black text-[#34C759]"
                      : i === selectedOption
                        ? "bg-black text-[#FF3B30]"
                        : "bg-[#E0E0E0] text-black/40"
                    : "bg-black text-white"}`}
              >
                {answerState !== "idle" && i === currentQ.correctIndex
                  ? "✓"
                  : answerState !== "idle" && i === selectedOption && selectedOption !== currentQ.correctIndex
                    ? "✗"
                    : String.fromCharCode(65 + i)}
              </div>
              <span className={`font-bold text-sm ${textColor}`}>{opt}</span>
              {answerState !== "idle" && i === currentQ.correctIndex && (
                <CheckCircle2 className="w-5 h-5 text-black ml-auto flex-shrink-0" />
              )}
              {answerState !== "idle" && i === selectedOption && selectedOption !== currentQ.correctIndex && (
                <XCircle className="w-5 h-5 text-white ml-auto flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div
          className={`border-4 border-black p-4 mb-4 pop-in ${answerState === "correct" ? "bg-[#34C759]" : "bg-[#FF3B30]"}`}
        >
          <div className="font-black text-black text-sm uppercase mb-1">
            {answerState === "correct" ? "✅ Correct!" : "❌ Wrong!"}
          </div>
          <p className="font-bold text-black text-sm leading-relaxed">{currentQ.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {answerState !== "idle" && (
        <button
          onClick={handleNext}
          className="w-full bg-black border-3 border-black py-4 font-black text-white text-sm uppercase tracking-wide shadow-[5px_5px_0px_#FFD60A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 pop-in"
        >
          {isLastQuestion ? (
            <><Trophy className="w-5 h-5" /> See Results</>
          ) : (
            <><ArrowRight className="w-5 h-5" /> Next Question</>
          )}
        </button>
      )}

      {/* Score tracker */}
      <div className="mt-4 flex items-center gap-2">
        {filteredQuestions.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-2 border-2 border-black"
            style={{
              backgroundColor:
                i < currentIndex
                  ? answers[i] === filteredQuestions[i].correctIndex
                    ? "#34C759"
                    : "#FF3B30"
                  : i === currentIndex
                    ? "#FFD60A"
                    : "#E0E0E0",
            }}
          />
        ))}
      </div>
    </div>
  );
}
