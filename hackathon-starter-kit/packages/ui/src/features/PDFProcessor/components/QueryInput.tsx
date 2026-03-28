import React from 'react';
import { Search, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface QueryInputProps {
  query: string;
  setQuery: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  extractedTextLength: number;
}

export const QueryInput: React.FC<QueryInputProps> = ({
  query,
  setQuery,
  onAnalyze,
  isAnalyzing,
  extractedTextLength
}) => {
  return (
    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center gap-2 text-[10px] text-green-500 font-bold bg-green-500/10 p-2 rounded-lg border border-green-500/20">
        <CheckCircle2 size={12} />
        TEXT EXTRACTED ({extractedTextLength} characters)
      </div>
      
      <div className="flex items-center gap-2 bg-background border border-border p-1.5 rounded-xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask the agent about this PDF..."
          className="flex-1 bg-transparent border-none px-2 py-1 text-xs outline-none"
        />
        <Button 
          size="sm" 
          onClick={onAnalyze} 
          className="h-8 w-8 p-0 rounded-lg"
          loading={isAnalyzing}
        >
          <Search size={14} />
        </Button>
      </div>
    </div>
  );
};
