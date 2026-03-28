import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ModeSelectorProps {
  currentTheme: string | undefined;
  toggleTheme: (mode: string) => void;
}

export function ModeSelector({ currentTheme, toggleTheme }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        onClick={() => toggleTheme('light')}
        className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border transition-all ${
          currentTheme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent'
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
        <span className="text-2xs font-heading">Light</span>
      </button>
      <button
        onClick={() => toggleTheme('dark')}
        className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border transition-all ${
          currentTheme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent'
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
        <span className="text-2xs font-heading">Dark</span>
      </button>
      <button
        onClick={() => toggleTheme('system')}
        className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border transition-all ${
          currentTheme === 'system' ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent'
        }`}
      >
        <Monitor className="w-3.5 h-3.5" />
        <span className="text-2xs font-heading">Auto</span>
      </button>
    </div>
  );
}
