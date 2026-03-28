"use client";

import { useState, useCallback } from "react";
import { ArrowLeft, Play, CheckCircle, XCircle, Terminal, Code2, ChevronRight } from "lucide-react";
import { TopicScore, QuestionResult } from "@/lib/edtech/conceptGraph";

interface CodingProblem {
  id: string;
  topic: string;
  title: string;
  description: string;
  starterCode: string;
  testCases: { input: string; expectedOutput: string; label: string }[];
  hint: string;
}

const CODING_PROBLEMS: Record<string, CodingProblem[]> = {
  DSA: [
    {
      id: "dsa-code-1",
      topic: "Arrays",
      title: "Find the Maximum Element",
      description:
        "Given an array of integers, return the maximum element.\n\nExample:\nInput: [3, 1, 7, 2, 5]\nOutput: 7",
      starterCode: `function findMax(arr) {
  // Write your solution here
  
}`,
      testCases: [
        { input: "[3, 1, 7, 2, 5]", expectedOutput: "7", label: "Basic array" },
        { input: "[-5, -1, -8, -2]", expectedOutput: "-1", label: "All negatives" },
        { input: "[42]", expectedOutput: "42", label: "Single element" },
      ],
      hint: "Try iterating through the array and keeping track of the largest value seen so far.",
    },
    {
      id: "dsa-code-2",
      topic: "Loops",
      title: "Sum of Array",
      description:
        "Write a function that returns the sum of all elements in an array.\n\nExample:\nInput: [1, 2, 3, 4, 5]\nOutput: 15",
      starterCode: `function sumArray(arr) {
  // Write your solution here
  
}`,
      testCases: [
        { input: "[1, 2, 3, 4, 5]", expectedOutput: "15", label: "Positive numbers" },
        { input: "[0, 0, 0]", expectedOutput: "0", label: "All zeros" },
        { input: "[-1, 1, -2, 2]", expectedOutput: "0", label: "Mixed signs" },
      ],
      hint: "Use a loop to iterate through the array and accumulate a running total.",
    },
    {
      id: "dsa-code-3",
      topic: "Recursion",
      title: "Factorial",
      description:
        "Write a recursive function to calculate the factorial of n.\n\nExample:\nInput: 5\nOutput: 120 (5 × 4 × 3 × 2 × 1)",
      starterCode: `function factorial(n) {
  // Write your recursive solution here
  
}`,
      testCases: [
        { input: "5", expectedOutput: "120", label: "n = 5" },
        { input: "0", expectedOutput: "1", label: "Base case n = 0" },
        { input: "1", expectedOutput: "1", label: "n = 1" },
      ],
      hint: "Every recursive function needs a base case. What should factorial(0) return?",
    },
  ],
  "Web Dev": [
    {
      id: "web-code-1",
      topic: "JS Basics",
      title: "Reverse a String",
      description:
        "Write a function that reverses a string.\n\nExample:\nInput: 'hello'\nOutput: 'olleh'",
      starterCode: `function reverseString(str) {
  // Write your solution here
  
}`,
      testCases: [
        { input: "'hello'", expectedOutput: "'olleh'", label: "Basic string" },
        { input: "'racecar'", expectedOutput: "'racecar'", label: "Palindrome" },
        { input: "''", expectedOutput: "''", label: "Empty string" },
      ],
      hint: "Try splitting the string into characters, reversing the array, and joining it back.",
    },
  ],
  Python: [
    {
      id: "py-code-1",
      topic: "Functions",
      title: "FizzBuzz",
      description:
        "Write a function that returns 'Fizz' for multiples of 3, 'Buzz' for multiples of 5, 'FizzBuzz' for both, and the number otherwise.\n\nExample:\nInput: 15\nOutput: 'FizzBuzz'",
      starterCode: `def fizzbuzz(n):
    # Write your solution here
    pass`,
      testCases: [
        { input: "15", expectedOutput: "'FizzBuzz'", label: "Multiple of both" },
        { input: "9", expectedOutput: "'Fizz'", label: "Multiple of 3" },
        { input: "10", expectedOutput: "'Buzz'", label: "Multiple of 5" },
        { input: "7", expectedOutput: "7", label: "Neither" },
      ],
      hint: "Check for the most specific condition (FizzBuzz) first, then individual ones.",
    },
  ],
  "App Dev": [
    {
      id: "app-code-1",
      topic: "JS Basics",
      title: "Count Vowels",
      description:
        "Write a function that counts the number of vowels in a string.\n\nExample:\nInput: 'hello world'\nOutput: 3",
      starterCode: `function countVowels(str) {
  // Write your solution here
  
}`,
      testCases: [
        { input: "'hello world'", expectedOutput: "3", label: "Basic test" },
        { input: "'rhythm'", expectedOutput: "0", label: "No vowels" },
        { input: "'aeiou'", expectedOutput: "5", label: "All vowels" },
      ],
      hint: "Create a string of all vowels and check each character against it.",
    },
  ],
};

interface CodingLabScreenProps {
  domain: string;
  onComplete: (scores: Record<string, TopicScore>, results: QuestionResult[]) => void;
  onBack: () => void;
}

type TestStatus = "idle" | "pass" | "fail";

export default function CodingLabScreen({ domain, onComplete, onBack }: CodingLabScreenProps) {
  const problems = CODING_PROBLEMS[domain] || CODING_PROBLEMS["DSA"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState(problems[0].starterCode);
  const [testStatuses, setTestStatuses] = useState<TestStatus[]>([]);
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completedProblems, setCompletedProblems] = useState<Set<number>>(new Set());
  const [startTime] = useState(Date.now());

  const currentProblem = problems[currentIndex];

  const runCode = useCallback(() => {
    setIsRunning(true);
    setOutput("");
    setShowHint(false);

    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`return (${code})`)();
      const results: TestStatus[] = [];
      let outputLines: string[] = [];

      currentProblem.testCases.forEach((tc, i) => {
        try {
          // A bit hacky but works for simple JS types in browser
          const inputVal = eval(tc.input); 
          const actual = fn(inputVal);
          const expected = eval(tc.expectedOutput);
          const passed = JSON.stringify(actual) === JSON.stringify(expected);
          results.push(passed ? "pass" : "fail");
          outputLines.push(
            `Test ${i + 1} (${tc.label}): ${passed ? "✅ PASS" : `❌ FAIL — got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`}`
          );
        } catch {
          results.push("fail");
          outputLines.push(`Test ${i + 1} (${tc.label}): ❌ ERROR — Check your function signature`);
        }
      });

      setTestStatuses(results);
      setOutput(outputLines.join("\n"));

      if (results.every((r) => r === "pass")) {
        setCompletedProblems((prev) => new Set([...prev, currentIndex]));
      }
    } catch (err: any) {
      setOutput(`❌ Syntax Error: ${err.message}`);
      setTestStatuses(currentProblem.testCases.map(() => "fail"));
    }

    setIsRunning(false);
  }, [code, currentProblem, currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < problems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCode(problems[currentIndex + 1].starterCode);
      setTestStatuses([]);
      setOutput("");
      setShowHint(false);
    }
  }, [currentIndex, problems]);

  const handleFinish = useCallback(() => {
    const scores: Record<string, TopicScore> = {};
    const rawResults: QuestionResult[] = [];
    const elapsed = Math.round((Date.now() - startTime) / 1000);

    problems.forEach((p, i) => {
      const passed = completedProblems.has(i);
      scores[p.topic] = scores[p.topic] || { score: 0, time: 0 };
      scores[p.topic].score = passed ? 85 : 30;
      scores[p.topic].time = elapsed;
      rawResults.push({
        questionId: p.id,
        topic: p.topic,
        isCorrect: passed,
        timeSpent: elapsed,
      });
    });

    onComplete(scores, rawResults);
  }, [problems, completedProblems, startTime, onComplete]);

  const allPassed = testStatuses.length > 0 && testStatuses.every((s) => s === "pass");
  const isLastProblem = currentIndex === problems.length - 1;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Top bar */}
      <div
        style={{
          borderBottom: "4px solid #0D0D0D",
          background: "#0D0D0D",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          height: 52,
        }}
      >
        <button
          onClick={onBack}
          style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#FFD60A", fontWeight: 700 }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ display: "flex", gap: "0.5rem", marginLeft: "auto", alignItems: "center" }}>
          {problems.map((_, i) => (
            <div
              key={i}
              style={{
                width: 28, height: 28,
                border: "2px solid #FFD60A",
                background: completedProblems.has(i) ? "#FFD60A" : i === currentIndex ? "#333" : "transparent",
                color: completedProblems.has(i) ? "#0D0D0D" : "#FFD60A",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.75rem", fontWeight: 800, cursor: "pointer",
              }}
              onClick={() => { setCurrentIndex(i); setCode(problems[i].starterCode); setTestStatuses([]); setOutput(""); }}
            >
              {completedProblems.has(i) ? <CheckCircle size={14} /> : i + 1}
            </div>
          ))}
          <Code2 size={16} color="#FFD60A" style={{ marginLeft: 8 }} />
          <span style={{ color: "#FFD60A", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.08em" }}>
            CODING LAB — {domain}
          </span>
        </div>
      </div>

      {/* Main split layout */}
      <div style={{ display: "flex", flex: 1, minHeight: "calc(100vh - 108px)" }}>

        {/* LEFT: Problem panel */}
        <div
          style={{
            width: "38%",
            borderRight: "4px solid #0D0D0D",
            display: "flex",
            flexDirection: "column",
            background: "#F5F0E8",
          }}
        >
          {/* Problem header */}
          <div style={{ padding: "1.5rem", borderBottom: "3px solid #0D0D0D" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <span
                style={{
                  background: "#FFD60A", color: "#0D0D0D", fontWeight: 800,
                  fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase",
                  padding: "2px 8px", border: "2px solid #0D0D0D",
                }}
              >
                {currentProblem.topic}
              </span>
              <span style={{ fontSize: "0.7rem", color: "#666", fontWeight: 700 }}>
                Problem {currentIndex + 1} of {problems.length}
              </span>
            </div>
            <h2 style={{ fontWeight: 900, fontSize: "1.3rem", color: "#0D0D0D", margin: 0 }}>
              {currentProblem.title}
            </h2>
          </div>

          {/* Problem description */}
          <div style={{ padding: "1.5rem", flex: 1, overflowY: "auto" }}>
            <pre
              style={{
                fontFamily: "inherit", whiteSpace: "pre-wrap", fontSize: "0.9rem",
                lineHeight: 1.7, color: "#333", margin: 0,
              }}
            >
              {currentProblem.description}
            </pre>

            {/* Test Cases */}
            <div style={{ marginTop: "1.5rem" }}>
              <h4 style={{ fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0D0D0D", marginBottom: "0.75rem" }}>
                Test Cases
              </h4>
              {currentProblem.testCases.map((tc, i) => (
                <div
                  key={i}
                  style={{
                    border: "2px solid #0D0D0D",
                    padding: "0.75rem",
                    marginBottom: "0.5rem",
                    background: testStatuses[i] === "pass" ? "#d4edda" : testStatuses[i] === "fail" ? "#f8d7da" : "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  {testStatuses[i] === "pass" ? (
                    <CheckCircle size={16} color="#155724" />
                  ) : testStatuses[i] === "fail" ? (
                    <XCircle size={16} color="#721c24" />
                  ) : (
                    <div style={{ width: 16, height: 16, border: "2px solid #999", borderRadius: "50%" }} />
                  )}
                  <div>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#555" }}>{tc.label}</div>
                    <div style={{ fontSize: "0.8rem", fontFamily: "monospace", color: "#0D0D0D" }}>
                      {tc.input} → <strong>{tc.expectedOutput}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hint */}
            <button
              onClick={() => setShowHint(!showHint)}
              style={{
                marginTop: "1rem", background: "transparent", border: "2px solid #0D0D0D",
                padding: "0.4rem 1rem", cursor: "pointer", fontWeight: 700,
                fontSize: "0.8rem", width: "100%", textAlign: "left",
              }}
            >
              💡 {showHint ? "Hide" : "Show"} Hint
            </button>
            {showHint && (
              <div style={{ marginTop: "0.5rem", padding: "0.75rem", background: "#fff3cd", border: "2px solid #ffc107", fontSize: "0.85rem" }}>
                {currentProblem.hint}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Code editor panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#1e1e1e" }}>

          {/* Editor toolbar */}
          <div
            style={{
              padding: "0.5rem 1rem", borderBottom: "2px solid #333",
              display: "flex", alignItems: "center", gap: "0.75rem",
            }}
          >
            <Terminal size={14} color="#FFD60A" />
            <span style={{ color: "#888", fontSize: "0.75rem", fontFamily: "monospace" }}>
              solution.{domain === "Python" ? "py" : "js"}
            </span>
            <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
              {allPassed && !isLastProblem && (
                <button
                  onClick={handleNext}
                  style={{
                    background: "#FFD60A", color: "#0D0D0D", border: "2px solid #FFD60A",
                    padding: "0.4rem 1rem", cursor: "pointer", fontWeight: 800,
                    fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 4,
                  }}
                >
                  Next Problem <ChevronRight size={14} />
                </button>
              )}
              {(allPassed && isLastProblem) && (
                <button
                  onClick={handleFinish}
                  style={{
                    background: "#00C851", color: "#fff", border: "2px solid #00C851",
                    padding: "0.4rem 1.2rem", cursor: "pointer", fontWeight: 800,
                    fontSize: "0.8rem",
                  }}
                >
                  ✅ Submit All & See Results
                </button>
              )}
              {!allPassed && isLastProblem && completedProblems.size > 0 && (
                <button
                  onClick={handleFinish}
                  style={{
                    background: "transparent", color: "#888", border: "2px solid #555",
                    padding: "0.4rem 1rem", cursor: "pointer", fontWeight: 700,
                    fontSize: "0.75rem",
                  }}
                >
                  Skip & Finish
                </button>
              )}
              <button
                onClick={runCode}
                disabled={isRunning}
                style={{
                  background: "#FFD60A", color: "#0D0D0D", border: "none",
                  padding: "0.4rem 1.2rem", cursor: "pointer", fontWeight: 800,
                  fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 6,
                  opacity: isRunning ? 0.7 : 1,
                }}
              >
                <Play size={14} />
                {isRunning ? "Running..." : "Run Code"}
              </button>
            </div>
          </div>

          {/* Simple Code Edit Area (Mock Monaco for now to avoid dependency noise in rebase) */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            style={{
              flex: 1, background: "#1e1e1e", color: "#d4d4d4",
              border: "none", outline: "none", padding: "1.5rem",
              fontFamily: "'Fira Code', 'Courier New', monospace",
              fontSize: "0.9rem", lineHeight: 1.7, resize: "none",
            }}
          />

          {/* Output panel */}
          {output && (
            <div
              style={{
                borderTop: "2px solid #333", background: "#0d0d0d",
                padding: "1rem 1.5rem", maxHeight: 160, overflowY: "auto",
              }}
            >
              <div style={{ color: "#888", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                OUTPUT
              </div>
              <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "0.82rem", color: "#d4d4d4", whiteSpace: "pre-wrap" }}>
                {output}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
