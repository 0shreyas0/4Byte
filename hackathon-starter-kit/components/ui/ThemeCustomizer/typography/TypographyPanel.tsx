import React from 'react';
import { FontSelector } from './FontSelector';

interface TypographyPanelProps {
  activeFont: string;
  handleFontChange: (id: string) => void;
}

export function TypographyPanel({
  activeFont,
  handleFontChange,
}: TypographyPanelProps) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-accent/50 border border-border/50">
        <p className="text-2xs font-heading text-muted-foreground uppercase tracking-widest mb-3 text-center">Preview</p>
        <div className="space-y-2 text-center">
          <h1 className="text-h3 font-heading leading-tight">Ag</h1>
          <p className="text-xs font-body text-muted-foreground line-clamp-2">
            The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      </div>
      
      <FontSelector 
        activeFont={activeFont} 
        handleFontChange={handleFontChange} 
      />
    </div>
  );
}
