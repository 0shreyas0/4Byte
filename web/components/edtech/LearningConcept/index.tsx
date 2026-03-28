"use client";

import { useState } from "react";
import { BookOpen, ArrowRight, Lightbulb, Code, CheckCircle2 } from "lucide-react";

interface LearningConceptProps {
  domain: string;
  onComplete: () => void;
  onBack: () => void;
}

const CONCEPT_DATA: Record<string, any[]> = {
  DSA: [
    {
      title: "The Logic of Loops",
      concept: "What is an iteration?",
      content: "Think of a loop as a 'repeat instruction'. If you want to clap 5 times, you don't write 'clap' 5 times. You tell the computer: 'Start at clap 0, keep going while claps < 5, and add 1 clap each time.'",
      visual: "🔄 Loop cycle: Setup -> Condition -> Code -> Update",
      example: "for (i=0; i<5; i++) { clap(); }"
    },
    {
      title: "Navigating Arrays",
      concept: "Contiguous Memory",
      content: "An array is like a street with houses. Each house has an address (index). Addresses start at 0. Accessing a house is instant (O(1)) if you have the address.",
      visual: "[ House 0 | House 1 | House 2 | House 3 ]",
      example: "strangers_things[4] = 'Eddie';"
    }
  ],
  "Web Dev": [
    {
      title: "HTML: The Skeleton",
      concept: "Tags and Elements",
      content: "HTML describes the structure of a page. Tags like <h1> or <a> are the building blocks. Every tag has a purpose.",
      visual: "🧱 <h1> = Header | <a> = Link",
      example: "<a href='...'>Click Me</a>"
    }
  ]
};

export default function LearningConcept({ domain, onComplete, onBack }: LearningConceptProps) {
  const [step, setStep] = useState(0);
  const data = CONCEPT_DATA[domain] || CONCEPT_DATA["DSA"];
  const current = data[step];

  const handleNext = () => {
    if (step < data.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-sm font-black uppercase opacity-60 hover:opacity-100 italic transition-opacity">
          ← Exit Journey
        </button>
        <div className="flex gap-2">
          {data.map((_, i) => (
            <div 
              key={i} 
              className="h-2 w-12 border-2 border-black"
              style={{ background: i <= step ? "#8B5CF6" : "#EEE" }}
            />
          ))}
        </div>
      </div>

      {/* Main Concept Card */}
      <div 
        className="p-10 mb-8 transition-all"
        style={{
          background: "#FFFFFF",
          border: "4px solid #0D0D0D",
          boxShadow: "10px 10px 0 #0D0D0D",
        }}
      >
        <div className="flex items-center gap-3 mb-4 text-[#8B5CF6]">
          <BookOpen size={24} strokeWidth={3} />
          <span className="text-xs font-black uppercase tracking-widest">{domain} Fundamentals</span>
        </div>

        <h1 className="text-4xl font-black mb-2 tracking-tight">{current.title}</h1>
        <div className="inline-block px-3 py-1 bg-[#F5F0E8] border-2 border-black text-xs font-black uppercase mb-8">
          Concept: {current.concept}
        </div>

        <div className="space-y-6">
          <p className="text-lg font-bold leading-relaxed text-gray-800">
            {current.content}
          </p>

          <div className="p-6 bg-[#0D0D0D] text-[#1DB954] font-mono text-sm border-4 border-[#8B5CF6]">
             <div className="flex items-center gap-2 mb-3 text-white/40 text-[10px] uppercase font-black tracking-widest">
                <Code size={14} /> Example Snippet
             </div>
             {current.example}
          </div>

          <div className="flex items-start gap-4 p-5 bg-[#F5F0E8] border-2 border-black border-dashed">
            <Lightbulb className="shrink-0 text-[#8B5CF6]" size={24} />
            <div>
               <div className="text-xs font-black uppercase mb-1">Visual Mental Model</div>
               <div className="text-sm font-bold opacity-80 italic">{current.visual}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleNext}
        className="w-full flex items-center justify-center gap-3 py-5 brutal-btn bg-black text-white text-lg font-black uppercase tracking-wider"
        style={{ boxShadow: "8px 8px 0 #8B5CF6" }}
      >
        {step < data.length - 1 ? (
          <>Next Concept <ArrowRight size={22} /></>
        ) : (
          <>Start Reality Check Quiz <CheckCircle2 size={22} /></>
        )}
      </button>

      <div className="mt-6 text-center text-xs font-black uppercase opacity-30 italic">
        Beginner Mode enabled • Dynamic Concept Generation active
      </div>
    </div>
  );
}
