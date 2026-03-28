import React from 'react';
import { Type } from 'lucide-react';
import { FONTS } from '../constants';

interface FontSelectorProps {
  activeFont: string;
  handleFontChange: (id: string) => void;
  title?: string;
}

export function FontSelector({ activeFont, handleFontChange, title = 'Typography' }: FontSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-2xs font-heading uppercase tracking-action text-muted-foreground">{title}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {FONTS.map((font) => (
          <button
            key={font.id}
            onClick={() => handleFontChange(font.id)}
            className={`px-3 py-1.5 rounded-lg border text-2xs font-heading transition-all ${
              activeFont === font.id 
                ? 'border-primary bg-primary text-primary-foreground' 
                : 'border-border hover:bg-accent text-foreground'
            }`}
            style={{ fontFamily: font.family }}
          >
            {font.name}
          </button>
        ))}
      </div>
    </div>
  );
}
