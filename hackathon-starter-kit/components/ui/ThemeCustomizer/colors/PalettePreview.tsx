import React from 'react';

interface PalettePreviewProps {
  activeVar: string;
  setActiveVar: (name: string) => void;
}

export function PalettePreview({ activeVar, setActiveVar }: PalettePreviewProps) {
  return (
    <div className="flex h-16 w-full rounded-xl overflow-hidden mb-6 border border-border shadow-inner group cursor-crosshair">
      {[
        { var: 'primary', label: 'Pri' },
        { var: 'background', label: 'Bg' },
        { var: 'foreground', label: 'Fg' },
        { var: 'secondary', label: 'Sec' },
        { var: 'accent', label: 'Acc' },
        { var: 'muted', label: 'Mut' },
        { var: 'border', label: 'Brd' }
      ].map((color) => (
        <button 
          key={color.var}
          onClick={() => setActiveVar(color.var)}
          className={`flex-1 transition-all duration-300 relative group/bar ${
            activeVar === color.var ? 'flex-[1.8] ring-2 ring-inset ring-primary/50' : 'hover:flex-[1.5]'
          }`}
          style={{ backgroundColor: `var(--${color.var})` }}
          title={`Edit ${color.var}`}
        >
          <div className={`absolute inset-0 transition-colors flex items-end justify-center pb-1 ${
            activeVar === color.var ? 'bg-foreground/10' : 'bg-foreground/0 group-hover/bar:bg-foreground/10'
          }`}>
            <span className={`text-5xs font-heading text-white transition-opacity drop-shadow-md uppercase tracking-heading ${
              activeVar === color.var ? 'opacity-100' : 'opacity-0 group-hover/bar:opacity-100'
            }`}>
              {color.label}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
