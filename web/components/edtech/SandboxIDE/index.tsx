"use client";

import { useState } from "react";
import { Terminal, Play, CheckCircle2, XCircle, Code, ArrowLeft } from "lucide-react";

export type LearningMode = "beginner" | "revision";

interface SandboxIDEProps {
  domain: string;
  mode: LearningMode;
  onExit: () => void;
}

interface CodeChallenge {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  boilerplate: string;
  solution: string; // for testing or hinting
  testCases: { args: any[]; expected: any }[]; // 🔥 Added
}

// 5 challenges per mode
const CHALLENGES: Record<string, CodeChallenge[]> = {
  beginner: [
    {
      id: "b1",
      title: "Two Sum",
      difficulty: "Easy",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      boilerplate: `function twoSum(nums, target) {\n  // your code here\n}`,
      solution: `function twoSum(nums, target) { for(let i=0;i<nums.length;i++){ for(let j=i+1;j<nums.length;j++){ if(nums[i]+nums[j]===target) return [i,j] } } }`,
      testCases: [ { args: [[2,7,11,15], 9], expected: [0,1] }, { args: [[3,2,4], 6], expected: [1,2] } ]
    },
    {
      id: "b2",
      title: "Reverse String",
      difficulty: "Easy",
      description: "Write a function that reverses a string. The input string is given as an array of characters s.",
      boilerplate: `function reverseString(s) {\n  // your code here\n}`,
      solution: `function reverseString(s) { return s.reverse(); }`,
      testCases: [ { args: [["h","e","l","l","o"]], expected: ["o","l","l","e","h"] } ]
    },
    {
      id: "b3",
      title: "Valid Palindrome",
      difficulty: "Easy",
      description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
      boilerplate: `function isPalindrome(s) {\n  // your code here\n}`,
      solution: `function isPalindrome(s) { const clean = s.replace(/[^A-Za-z0-9]/g, '').toLowerCase(); return clean === clean.split('').reverse().join(''); }`,
      testCases: [ { args: ["A man, a plan, a canal: Panama"], expected: true }, { args: ["race a car"], expected: false } ]
    },
    {
      id: "b4",
      title: "Valid Anagram",
      difficulty: "Medium",
      description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
      boilerplate: `function isAnagram(s, t) {\n  // your code here\n}`,
      solution: `function isAnagram(s, t) { return s.split('').sort().join('') === t.split('').sort().join(''); }`,
      testCases: [ { args: ["anagram", "nagaram"], expected: true }, { args: ["rat", "car"], expected: false } ]
    },
    {
      id: "b5",
      title: "Binary Search",
      difficulty: "Medium",
      description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
      boilerplate: `function search(nums, target) {\n  // your code here\n}`,
      solution: `function search(nums, target) { let l=0, r=nums.length-1; while(l<=r){let m=Math.floor((l+r)/2); if(nums[m]===target) return m; else if(nums[m]<target) l=m+1; else r=m-1;} return -1; }`,
      testCases: [ { args: [[-1,0,3,5,9,12], 9], expected: 4 }, { args: [[-1,0,3,5,9,12], 2], expected: -1 } ]
    }
  ],
  revision: [
    {
      id: "r1",
      title: "Two Sum",
      difficulty: "Easy",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      boilerplate: `function twoSum(nums, target) {\n  // your code here\n}`,
      solution: `function twoSum(nums, target) { const map = new Map(); for(let i=0;i<nums.length;i++){ let diff = target - nums[i]; if(map.has(diff)) return [map.get(diff), i]; map.set(nums[i], i); } }`,
      testCases: [ { args: [[2,7,11,15], 9], expected: [0,1] } ]
    },
    {
      id: "r2",
      title: "Reverse String",
      difficulty: "Easy",
      description: "Write a function that reverses a string.",
      boilerplate: `function reverseString(s) {\n  // your code here\n}`,
      solution: `function reverseString(s) { return s.reverse() }`,
      testCases: [ { args: [["h","e","l","l","o"]], expected: ["o","l","l","e","h"] } ]
    },
    {
      id: "r3",
      title: "Binary Search",
      difficulty: "Medium",
      description: "Search target in sorted ascending array nums. Return index or -1. Must be O(log n).",
      boilerplate: `function search(nums, target) {\n  // your code here\n}`,
      solution: `function search(nums, target) { let l=0, r=nums.length-1; while(l<=r){let m=Math.floor((l+r)/2); if(nums[m]===target) return m; else if(nums[m]<target) l=m+1; else r=m-1;} return -1; }`,
      testCases: [ { args: [[-1,0,3,5,9,12], 9], expected: 4 } ]
    },
    {
      id: "r4",
      title: "Merge Intervals",
      difficulty: "Medium",
      description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
      boilerplate: `function merge(intervals) {\n  // your code here\n}`,
      solution: `function merge(intervals) { intervals.sort((a,b)=>a[0]-b[0]); const res = [intervals[0]]; for(let i=1;i<intervals.length;i++){ let last = res[res.length-1]; if(intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1]); else res.push(intervals[i]); } return res; }`,
      testCases: [ { args: [[[1,3],[2,6],[8,10],[15,18]]], expected: [[1,6],[8,10],[15,18]] } ]
    },
    {
      id: "r5",
      title: "Trapping Rain Water",
      difficulty: "Hard",
      description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      boilerplate: `function trap(height) {\n  // your code here\n}`,
      solution: `function trap(height) { let l=0, r=height.length-1, lmax=0, rmax=0, ans=0; while(l<r) { if(height[l]<height[r]) { height[l]>=lmax ? lmax=height[l] : ans+=lmax-height[l]; l++; } else { height[r]>=rmax ? rmax=height[r] : ans+=rmax-height[r]; r--; } } return ans; }`,
      testCases: [ { args: [[0,1,0,2,1,0,1,3,2,1,2,1]], expected: 6 } ]
    }
  ]
};

const LANGUAGES = ["JavaScript", "Python", "C++", "C", "Java", "Go", "Rust"];

const LANGUAGE_TEMPLATES: Record<string, string> = {
  JavaScript: `// Write your code here...\n`,
  Python: `def main():\n    # Write your code here\n    pass\n\nif __name__ == "__main__":\n    main()`,
  "C++": `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}`,
  C: `#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}`,
  Java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}`,
  Go: `package main\n\nimport (\n\t"fmt"\n)\n\nfunc main() {\n    // Write your code here\n}`,
  Rust: `fn main() {\n    // Write your code here\n}`
};

export default function SandboxIDE({ domain, mode, onExit }: SandboxIDEProps) {
  const challenges = CHALLENGES[mode] || CHALLENGES["beginner"];
  const [activeIdx, setActiveIdx] = useState(0);
  const [language, setLanguage] = useState("JavaScript");
  const [code, setCode] = useState(challenges[0].boilerplate);
  const activeChallenge = challenges[activeIdx];
  const [testResult, setTestResult] = useState<"idle" | "running" | "pass" | "fail">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSelect = (idx: number) => {
    setActiveIdx(idx);
    setCode(language === "JavaScript" ? challenges[idx].boilerplate : LANGUAGE_TEMPLATES[language]);
    setTestResult("idle");
    setErrorMsg("");
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(lang === "JavaScript" ? activeChallenge.boilerplate : LANGUAGE_TEMPLATES[lang]);
    setTestResult("idle");
    setErrorMsg("");
  };

  const handleRun = () => {
    setTestResult("running");
    setErrorMsg("");

    setTimeout(() => {
      // ── Non-JS: heuristic only ─────────────────────────────────────────
      if (language !== "JavaScript") {
        const hasLogic = code.includes("return") || code.includes("print") ||
          code.includes("cout") || code.includes("fmt") || code.includes("printf");
        const changedEnough = code.length > LANGUAGE_TEMPLATES[language].length + 15;
        if (!hasLogic || !changedEnough) {
          setTestResult("fail");
          setErrorMsg("Test Case 1 Failed.\nYou haven't implemented the algorithm yet.\nMake sure to write logic beyond the template.");
        } else {
          setTestResult("pass");
        }
        return;
      }

      // ── Guard 1: Untouched boilerplate ────────────────────────────────
      if (code.includes("// your code here")) {
        setTestResult("fail");
        setErrorMsg("Error: No code written!\nDelete '// your code here' and replace it with your actual solution.");
        return;
      }

      // ── Guard 2: Empty body ───────────────────────────────────────────
      const bodyMatch = code.match(/\{([\s\S]*)\}$/);
      if (!bodyMatch || bodyMatch[1].trim() === "") {
        setTestResult("fail");
        setErrorMsg("Error: Function body is empty. Write your logic inside the function.");
        return;
      }

      // ── Guard 3: No test cases defined ───────────────────────────────
      const tcs = activeChallenge.testCases;
      if (!tcs || tcs.length === 0) {
        setTestResult("fail");
        setErrorMsg("Error: No test cases found for this challenge.");
        return;
      }

      // ── Guard 4: Extract function name ───────────────────────────────
      const match = code.match(/function\s+([a-zA-Z0-9_]+)\s*\(/);
      if (!match) {
        setTestResult("fail");
        setErrorMsg("Syntax Error: No valid function declaration found.\nExample: function twoSum(nums, target) { ... }");
        return;
      }
      const funcName = match[1];

      // ── Core Eval: Script-tag injection (most reliable in-browser) ────
      const runnerKey = `__runner_${Date.now()}`;

      // Inject test harness into window so it survives eval scope
      (window as any)[runnerKey] = { passed: 0, total: tcs.length, error: null, failMsg: null };

      const harnessScript = `
(function() {
  try {
    ${code}
    if (typeof ${funcName} !== 'function') {
      window['${runnerKey}'].error = "'${funcName}' is not callable. Check your function definition.";
      return;
    }
    var tcs = ${JSON.stringify(tcs)};
    for (var i = 0; i < tcs.length; i++) {
      var args = JSON.parse(JSON.stringify(tcs[i].args));
      var expected = tcs[i].expected;
      var result;
      try {
        result = ${funcName}.apply(null, args);
      } catch(re) {
        window['${runnerKey}'].error = "Runtime Error on Test Case " + (i+1) + ": " + re.message;
        return;
      }
      if (JSON.stringify(result) !== JSON.stringify(expected)) {
        window['${runnerKey}'].failMsg = (
          "Test Case " + (i+1) + " Failed\\n" +
          "  Input    : " + JSON.stringify(tcs[i].args) + "\\n" +
          "  Expected : " + JSON.stringify(expected) + "\\n" +
          "  Actual   : " + (result === undefined ? "undefined (forgot to return?)" : JSON.stringify(result))
        );
        return;
      }
      window['${runnerKey}'].passed++;
    }
  } catch(e) {
    window['${runnerKey}'].error = "Error: " + e.message;
  }
})();
      `;

      try {
        const script = document.createElement("script");
        script.textContent = harnessScript;
        document.body.appendChild(script);
        document.body.removeChild(script);

        const runner = (window as any)[runnerKey];
        delete (window as any)[runnerKey];

        if (runner.error) {
          setTestResult("fail");
          setErrorMsg(runner.error);
        } else if (runner.failMsg) {
          setTestResult("fail");
          setErrorMsg(runner.failMsg);
        } else if (runner.passed === tcs.length) {
          setTestResult("pass");
        } else {
          setTestResult("fail");
          setErrorMsg(`Only ${runner.passed}/${tcs.length} test cases passed.`);
        }
      } catch (e: any) {
        setTestResult("fail");
        setErrorMsg(`Execution Error: ${e.message}`);
      }
    }, 1200);
  };

  if (domain !== "DSA") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="p-6 bg-[#FFD60A] text-black border-4 border-black font-black text-2xl uppercase shadow-[8px_8px_0_#000]">
          IDE Practice is currently available for DSA only.
        </div>
        <button onClick={onExit} className="mt-8 font-black uppercase underline tracking-widest hover:text-[#8B5CF6] transition-colors">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b-4 border-black bg-white">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="flex items-center gap-2 font-black uppercase text-sm opacity-60 hover:opacity-100 transition-opacity">
            <ArrowLeft size={16} /> Exit IDE
          </button>
          <div className="w-1 h-6 bg-gray-200"></div>
          <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[#8B5CF6]">
            <Terminal size={20} /> DSA SANDBOX
          </div>
          <div className="px-2 py-1 bg-black text-[#FFD60A] text-[10px] font-black uppercase tracking-widest">
            {mode} Mode
          </div>
        </div>
        <button 
          onClick={handleRun}
          disabled={testResult === "running"}
          className="flex items-center gap-2 px-6 py-2 bg-[#1DB954] text-white font-black uppercase tracking-widest border-2 border-black hover:bg-[#17a348] transition-colors shadow-[4px_4px_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1"
        >
          {testResult === "running" ? (
            <span className="animate-pulse">Running...</span>
          ) : (
            <><Play size={16} fill="currentColor" /> Run Code</>
          )}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/4 min-w-[300px] border-r-4 border-black bg-white flex flex-col">
          <div className="p-4 border-b-2 border-dashed border-gray-300 font-black uppercase tracking-widest text-xs opacity-50">
            Challenges ({challenges.length})
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {challenges.map((c, i) => (
              <button
                key={c.id}
                onClick={() => handleSelect(i)}
                className="w-full text-left flex flex-col p-4 border-2 border-black transition-all"
                style={{
                  background: activeIdx === i ? "#FFD60A" : "#FFFFFF",
                  boxShadow: activeIdx === i ? "4px 4px 0 #000" : "none",
                  transform: activeIdx === i ? "translate(-2px, -2px)" : "none",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black truncate">{c.title}</span>
                  <span 
                    className="text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black"
                    style={{
                      background: c.difficulty === "Easy" ? "#1DB954" : c.difficulty === "Medium" ? "#FFD60A" : "#FF3B3B",
                      color: c.difficulty === "Easy" || c.difficulty === "Hard" ? "#FFF" : "#000",
                    }}
                  >
                    {c.difficulty}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Problem Statement */}
          <div className="p-6 border-b-4 border-black bg-white overflow-y-auto max-h-[35vh]">
            <h2 className="text-2xl font-black tracking-tight mb-2">{activeChallenge.title}</h2>
            <p className="text-gray-600 font-bold leading-relaxed mb-4">{activeChallenge.description}</p>
            
            <div className="space-y-4 mt-6">
              {activeChallenge.testCases?.slice(0, 2).map((tc, idx) => (
                <div key={idx} className="bg-[#f5f5f5] p-3 border-2 border-black relative">
                  <div className="absolute -top-3 left-2 bg-[#FFD60A] border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">
                    Example {idx + 1}
                  </div>
                  <div className="font-mono text-xs mt-2 space-y-1 text-gray-800">
                    <div><span className="font-black">Input:</span> {JSON.stringify(tc.args).replace(/^\[|\]$/g, '')}</div>
                    <div><span className="font-black">Output:</span> {JSON.stringify(tc.expected)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Code Editor */}
          <div className="flex-1 p-4 bg-[#0D0D0D] relative font-mono flex flex-col">
            <div className="flex justify-end mb-2">
              <div className="flex items-center gap-2 px-2 py-1 bg-[#222] border-2 border-[#333] rounded-sm relative focus-within:border-[#8B5CF6]">
                <Code size={14} className="text-[#8B5CF6]" />
                <select 
                  value={language}
                  onChange={handleLanguageChange}
                  className="bg-transparent text-xs font-black uppercase text-[#FFF] outline-none appearance-none cursor-pointer pr-4"
                  style={{ textAlignLast: "right" }}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang} className="bg-[#111]">{lang}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2 text-gray-500">▼</div>
              </div>
            </div>
            <textarea
              className="w-full flex-1 bg-transparent text-[#FFD60A] resize-none outline-none font-mono text-sm leading-relaxed"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
            />
          </div>
          
          {/* Output Console */}
          <div className="h-48 border-t-4 border-black bg-[#111] p-4 font-mono text-sm overflow-y-auto">
            <div className="text-xs font-black uppercase text-gray-500 mb-2">Console Output</div>
            {testResult === "idle" && <div className="text-gray-400 opacity-50 italic">Ready to run code...</div>}
            {testResult === "running" && <div className="text-[#FFD60A]">Executing tests...</div>}
            {testResult === "pass" && (
              <div className="flex items-center gap-2 text-[#1DB954] font-bold">
                <CheckCircle2 size={16} /> All Test Cases Passed! You nailed it.
              </div>
            )}
            {testResult === "fail" && (
              <div className="flex items-start gap-2 text-[#FF3B3B] font-bold">
                <XCircle size={16} className="shrink-0 mt-0.5" /> 
                <div className="whitespace-pre-wrap">
                  {errorMsg || "Syntax Error"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
