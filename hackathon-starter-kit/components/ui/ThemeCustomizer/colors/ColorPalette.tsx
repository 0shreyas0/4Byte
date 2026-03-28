import React from 'react';
import { Check, Pipette } from 'lucide-react';
import { COLORS } from '../constants';

interface ColorPaletteProps {
  activeColor: string;
  activeVar: string;
  isPartyMode: boolean;
  handleColorChange: (color: string) => void;
  handleRandomColor: () => void;
}

export function ColorPalette({ 
  activeColor, 
  activeVar,
  isPartyMode, 
  handleColorChange, 
  handleRandomColor 
}: ColorPaletteProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-2xs font-heading uppercase tracking-action text-muted-foreground">
          Editing: <span className="text-primary font-heading">{activeVar}</span>
        </p>
        <button 
          onClick={handleRandomColor}
          className="text-3xs font-heading text-primary hover:underline transition-all"
        >
          Shuffle Accent
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {COLORS.map((c) => (
          <button
            key={c.name}
            onClick={() => handleColorChange(c.value)}
            className="group relative flex flex-col items-center gap-1"
            aria-label={`Select ${c.name} color`}
          >
            <div 
              className={`h-9 w-9 rounded-full ${c.label} flex items-center justify-center transition-transform active:scale-95 relative overflow-hidden ring-offset-2 ring-primary group-hover:ring-2`}
            >
              {activeColor === c.value && !isPartyMode && (
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/10">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <span className="text-4xs font-heading text-muted-foreground truncate w-full text-center">
              {c.name}
            </span>
          </button>
        ))}
        {/* Custom Color Wheel Trigger */}
        <div className="group relative flex flex-col items-center gap-1">
          <label className="h-9 w-9 rounded-full bg-linear-to-tr from-red-500 via-green-500 to-blue-500 flex items-center justify-center cursor-pointer transition-transform active:scale-95 ring-offset-2 ring-primary hover:ring-2">
            <input 
              type="color" 
              className="sr-only"
              onChange={(e) => handleColorChange(e.target.value)}
            />
            <Pipette className="w-4 h-4 text-white drop-shadow-md" />
          </label>
          <span className="text-4xs font-heading text-muted-foreground">Pick</span>
        </div>
      </div>
    </div>
  );
}
