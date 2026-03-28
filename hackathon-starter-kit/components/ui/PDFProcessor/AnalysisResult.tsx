import React from 'react';
import { Sparkles } from 'lucide-react';

interface AnalysisResultProps {
  result: string;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl space-y-2 animate-in zoom-in-95 duration-300">
      <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-tighter">
        <Sparkles size={12} />
        Agent Analysis
      </div>
      <p className="text-[11px] leading-relaxed text-foreground/90 whitespace-pre-wrap">
        {result}
      </p>
    </div>
  );
};
