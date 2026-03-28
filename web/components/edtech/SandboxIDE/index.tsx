"use client";

import { useState } from "react";
import { Terminal, Play, CheckCircle2, XCircle, Code, ArrowLeft } from "lucide-react";
import { LearningMode } from "@/components/edtech/ModeSelection";

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
      solution: `function twoSum(nums, target) { for(let i=0;i<nums.length;i++){ for(let j=i+1;j<nums.length;j++){ if(nums[i]+nums[j]===target) return [i,j] } } }`
    },
    {
      id: "b2",
      title: "Reverse String",
      difficulty: "Easy",
      description: "Write a function that reverses a string. The input string is given as an array of characters s.",
      boilerplate: `function reverseString(s) {\n  // your code here\n}`,
      solution: `function reverseString(s) { return s.reverse(); }`
    },
    {
      id: "b3",
      title: "Valid Palindrome",
      difficulty: "Easy",
      description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
      boilerplate: `function isPalindrome(s) {\n  // your code here\n}`,
      solution: `function isPalindrome(s) { const clean = s.replace(/[^A-Za-z0-9]/g, '').toLowerCase(); return clean === clean.split('').reverse().join(''); }`
    },
    {
      id: "b4",
      title: "Valid Anagram",
      difficulty: "Medium",
      description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
      boilerplate: `function isAnagram(s, t) {\n  // your code here\n}`,
      solution: `function isAnagram(s, t) { return s.split('').sort().join('') === t.split('').sort().join(''); }`
    },
    {
      id: "b5",
      title: "Binary Search",
      difficulty: "Medium",
      description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
      boilerplate: `function search(nums, target) {\n  // your code here\n}`,
      solution: `function search(nums, target) { let l=0, r=nums.length-1; while(l<=r){let m=Math.floor((l+r)/2); if(nums[m]===target) return m; else if(nums[m]<target) l=m+1; else r=m-1;} return -1; }`
    }
  ],
  revision: [
    {
      id: "r1",
      title: "Two Sum",
      difficulty: "Easy",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      boilerplate: `function twoSum(nums, target) {\n  // your code here\n}`,
      solution: `function twoSum(nums, target) { const map = new Map(); for(let i=0;i<nums.length;i++){ let diff = target - nums[i]; if(map.has(diff)) return [map.get(diff), i]; map.set(nums[i], i); } }`
    },
    {
      id: "r2",
      title: "Reverse String",
      difficulty: "Easy",
      description: "Write a function that reverses a string.",
      boilerplate: `function reverseString(s) {\n  // your code here\n}`,
      solution: `function reverseString(s) { return s.reverse() }`
    },
    {
      id: "r3",
      title: "Binary Search",
      difficulty: "Medium",
      description: "Search target in sorted ascending array nums. Return index or -1. Must be O(log n).",
      boilerplate: `function search(nums, target) {\n  // your code here\n}`,
      solution: `function search(nums, target) { let l=0, r=nums.length-1; while(l<=r){let m=Math.floor((l+r)/2); if(nums[m]===target) return m; else if(nums[m]<target) l=m+1; else r=m-1;} return -1; }`
    },
    {
      id: "r4",
      title: "Merge Intervals",
      difficulty: "Medium",
      description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
      boilerplate: `function merge(intervals) {\n  // your code here\n}`,
      solution: `function merge(intervals) { intervals.sort((a,b)=>a[0]-b[0]); const res = [intervals[0]]; for(let i=1;i<intervals.length;i++){ let last = res[res.length-1]; if(intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1]); else res.push(intervals[i]); } return res; }`
    },
    {
      id: "r5",
      title: "Trapping Rain Water",
      difficulty: "Hard",
      description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      boilerplate: `function trap(height) {\n  // your code here\n}`,
      solution: `function trap(height) { let l=0, r=height.length-1, lmax=0, rmax=0, ans=0; while(l<r) { if(height[l]<height[r]) { height[l]>=lmax ? lmax=height[l] : ans+=lmax-height[l]; l++; } else { height[r]>=rmax ? rmax=height[r] : ans+=rmax-height[r]; r--; } } return ans; }`
    }
  ]
};

export default function SandboxIDE({ domain, mode, onExit }: SandboxIDEProps) {
  const challenges = CHALLENGES[mode] || CHALLENGES["beginner"];
  const [activeIdx, setActiveIdx] = useState(0);
  const [code, setCode] = useState(challenges[0].boilerplate);
  const activeChallenge = challenges[activeIdx];
  const [testResult, setTestResult] = useState<"idle" | "running" | "pass" | "fail">("idle");

  const handleSelect = (idx: number) => {
    setActiveIdx(idx);
    setCode(challenges[idx].boilerplate);
    setTestResult("idle");
  };

  const handleRun = () => {
    setTestResult("running");
    setTimeout(() => {
      // Very basic simulation of run
      if (code.includes("return") && code.length > activeChallenge.boilerplate.length + 5) {
        setTestResult("pass");
      } else {
        setTestResult("fail");
      }
    }, 1500);
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
          <div className="p-6 border-b-4 border-black bg-white">
            <h2 className="text-2xl font-black tracking-tight mb-2">{activeChallenge.title}</h2>
            <p className="text-gray-600 font-bold leading-relaxed">{activeChallenge.description}</p>
          </div>
          
          {/* Code Editor */}
          <div className="flex-1 p-4 bg-[#0D0D0D] relative font-mono">
            <div className="absolute top-0 right-0 p-2 text-xs font-black uppercase text-gray-600 pointer-events-none">
              <Code size={16} className="inline mr-1" /> JavaScript
            </div>
            <textarea
              className="w-full h-full bg-transparent text-[#FFD60A] resize-none outline-none font-mono text-sm leading-relaxed"
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
                <CheckCircle2 size={16} /> All 14 Test Cases Passed! You nailed it.
              </div>
            )}
            {testResult === "fail" && (
              <div className="flex items-start gap-2 text-[#FF3B3B] font-bold">
                <XCircle size={16} className="shrink-0 mt-0.5" /> 
                <div>
                  Test Case 1 Failed: <br/>
                  Expected Output: [0, 1] <br/>
                  Actual Output: undefined
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
