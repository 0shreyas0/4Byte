import React from 'react';

const SUGGESTED_PROMPTS = [
  "Explain the tech stack",
  "Generate logo idea",
  "Write project plan"
];

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-wrap gap-1.5 pt-2">
      {SUGGESTED_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          className="text-xs px-3 py-1.5 rounded-full border border-border bg-background/50 hover:bg-primary/10 hover:border-primary/30 transition-all text-muted-foreground hover:text-primary whitespace-nowrap font-action"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};
