import React from 'react';
import { Sparkles } from 'lucide-react';

interface AIDemoResponseProps {
  response: string;
}

export const AIDemoResponse: React.FC<AIDemoResponseProps> = ({ response }) => {
  if (!response) return null;

  return (
    <div className="bg-muted/50 border border-border rounded-xl p-4 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-2 mb-2 text-primary font-heading">
        <Sparkles size={14} />
        AI RESPONSE:
      </div>
      <p className="text-muted-foreground whitespace-pre-wrap leading-body">
        {response}
      </p>
    </div>
  );
};
