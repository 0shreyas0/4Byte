"use client";

import { Zap, ArrowRight, Code2, BookOpen, Layers, Terminal } from "lucide-react";

export type QuizMode = "mcq" | "coding";

interface ModeSelectionProps {
  domain: string;
  onSelect: (mode: QuizMode) => void;
  onBack: () => void;
}

export default function ModeSelection({ domain, onSelect, onBack }: ModeSelectionProps) {
  // Only show Coding option for supported domains
  const CODING_DOMAINS = ["DSA", "Web Dev", "Python", "App Dev"];
  const supportsCoding = CODING_DOMAINS.includes(domain);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <div className="inline-block px-4 py-1.5 bg-black text-[#FFD60A] text-xs font-black uppercase tracking-widest mb-4 border-2 border-black">
          Domain: {domain}
        </div>
        <h1 className="text-5xl font-black mb-4 tracking-tighter" style={{ lineHeight: 0.9 }}>
          PICK YOUR <br /> CHALLENGE MODE
        </h1>
        <p className="text-lg font-bold opacity-70">
          How do you want to test and improve your knowledge today?
        </p>
      </div>

      <div className={`grid grid-cols-1 ${supportsCoding ? 'md:grid-cols-2' : ''} gap-8`}>
        {/* MCQ Mode */}
        <button
          onClick={() => onSelect("mcq")}
          className="group relative flex flex-col items-start p-8 text-left transition-all hover:-translate-x-2 hover:-translate-y-2"
          style={{
            background: "#FFFFFF",
            border: "4px solid #0D0D0D",
            boxShadow: "12px 12px 0 #0D0D0D",
          }}
        >
          <div className="mb-6 p-4 bg-[#8B5CF6] border-4 border-black group-hover:rotate-6 transition-transform">
            <Zap size={44} color="white" />
          </div>
          <h2 className="text-3xl font-black mb-3 text-black">MCQ PATH</h2>
          <p className="text-base font-bold text-gray-600 mb-8 leading-relaxed">
            Test your theoretical understanding with 10 rapid-fire questions. 
            Perfect for identifying conceptual gaps and fixing foundations.
          </p>
          
          <div className="mt-auto flex items-center gap-2 text-sm font-black uppercase tracking-wider text-[#8B5CF6]">
            Start Quiz <ArrowRight size={18} />
          </div>

          <div className="absolute top-4 right-4 flex gap-1">
             <BookOpen size={16} className="opacity-20" />
             <Layers size={16} className="opacity-20" />
          </div>
        </button>

        {/* Coding Mode */}
        {supportsCoding && (
          <button
            onClick={() => onSelect("coding")}
            className="group relative flex flex-col items-start p-8 text-left transition-all hover:-translate-x-2 hover:-translate-y-2"
            style={{
              background: "#FFD60A",
              border: "4px solid #0D0D0D",
              boxShadow: "12px 12px 0 #0D0D0D",
            }}
          >
            <div className="mb-6 p-4 bg-black border-4 border-[#FFD60A] group-hover:-rotate-6 transition-transform">
              <Code2 size={44} color="#FFD60A" />
            </div>
            <h2 className="text-3xl font-black mb-3 text-black">CODING LAB</h2>
            <p className="text-base font-bold text-gray-900 mb-8 leading-relaxed">
              Solve real-world coding problems in our integrated IDE. 
              We&apos;ll run your code against test cases and provide deep analysis.
            </p>
            
            <div className="mt-auto flex items-center gap-2 text-sm font-black uppercase tracking-wider text-black">
              Enter Lab <ArrowRight size={18} />
            </div>

            <div className="absolute top-4 right-4">
               <Terminal size={18} className="opacity-40" />
            </div>
          </button>
        )}
      </div>

      <div className="mt-12 text-center">
        <button 
          onClick={onBack}
          className="font-black text-sm uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity underline underline-offset-4"
        >
          ← Change Domain
        </button>
      </div>

      {/* Aesthetic Accents */}
      <div className="fixed bottom-10 left-10 pointer-events-none opacity-10 font-black text-8xl">TEST</div>
      <div className="fixed top-20 right-10 pointer-events-none opacity-10 font-black text-8xl rotate-90">CODE</div>
    </div>
  );
}
