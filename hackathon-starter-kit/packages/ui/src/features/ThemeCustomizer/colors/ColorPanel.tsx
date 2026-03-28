'use client';

import React, { useRef, useState } from 'react';
import { Pipette, Shuffle, Sun, Moon, Monitor } from 'lucide-react';
import { PalettePreview } from './PalettePreview';
import { COLORS } from '../constants';

interface ColorPanelProps {
  activeColor: string;
  activeVar: string;
  setActiveVar: (name: string) => void;
  isPartyMode: boolean;
  setIsPartyMode: (v: boolean) => void;
  handleColorChange: (color: string) => void;
  handleRandomColor: () => void;
  currentThemeMode: string | undefined;
  toggleTheme: (mode: string) => void;
  globalRadius: number;
  onRadiusChange: (r: number) => void;
}

export function ColorPanel({
  activeColor, activeVar, setActiveVar, isPartyMode, setIsPartyMode,
  handleColorChange, handleRandomColor, currentThemeMode, toggleTheme,
  globalRadius, onRadiusChange,
}: ColorPanelProps) {
  const pickerRef = useRef<HTMLInputElement>(null);
  const [hexInput, setHexInput] = useState('');

  const handleHexCommit = () => {
    const val = hexInput.startsWith('#') ? hexInput : `#${hexInput}`;
    if (/^#[0-9a-fA-F]{6}$/.test(val)) { handleColorChange(val); setHexInput(''); }
  };

  const MODES = [
    { id: 'light', icon: <Sun className="w-3.5 h-3.5" />, label: 'Light' },
    { id: 'dark',  icon: <Moon className="w-3.5 h-3.5" />, label: 'Dark' },
    { id: 'system', icon: <Monitor className="w-3.5 h-3.5" />, label: 'Auto' },
  ];

  return (
    <div className="space-y-5">
      {/* The 7-color interactive palette strip — click a swatch to select which variable to edit */}
      <PalettePreview activeVar={activeVar} setActiveVar={setActiveVar} />

      {/* Light / Dark / Auto mode toggle */}
      <div className="grid grid-cols-3 gap-2">
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => toggleTheme(m.id)}
            className={`flex flex-col items-center justify-center gap-1.5 py-2 rounded-xl border transition-all ${
              currentThemeMode === m.id
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:bg-accent text-muted-foreground hover:text-foreground'
            }`}
          >
            {m.icon}
            <span className="text-2xs font-action">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Editing label + hex input row */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-muted-foreground">
            Editing: <span className="text-primary">{activeVar}</span>
          </p>
          <button onClick={handleRandomColor} className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
            <Shuffle className="w-3 h-3" /> Shuffle
          </button>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-muted/60 border border-border rounded-xl px-3 py-2">
            <div className="w-4 h-4 rounded-full border border-border shrink-0" style={{ backgroundColor: activeColor }} />
            <input
              type="text"
              value={hexInput || activeColor}
              onChange={e => setHexInput(e.target.value)}
              onBlur={handleHexCommit}
              onKeyDown={e => e.key === 'Enter' && handleHexCommit()}
              className="flex-1 bg-transparent text-xs font-mono text-foreground outline-none min-w-0"
              placeholder="#000000"
              maxLength={7}
            />
          </div>
          <label className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted/60 border border-border cursor-pointer hover:border-primary/50 transition-colors shrink-0" title="Open color picker">
            <input ref={pickerRef} type="color" className="sr-only" value={activeColor} onChange={e => handleColorChange(e.target.value)} />
            <Pipette className="w-4 h-4 text-muted-foreground" />
          </label>
        </div>
      </div>

      {/* Preset swatches */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-2">Presets</p>
        <div className="grid grid-cols-6 gap-2">
          {COLORS.map(c => (
            <button
              key={c.name}
              onClick={() => handleColorChange(c.value)}
              title={c.name}
              className="group relative aspect-square rounded-xl border-2 transition-all hover:scale-110 active:scale-95 shadow-sm"
              style={{ backgroundColor: c.value, borderColor: activeColor === c.value ? c.value : 'transparent' }}
            >
              {activeColor === c.value && !isPartyMode && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white shadow" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Radius control */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-semibold text-muted-foreground">Border Radius</p>
          <span className="text-xs font-medium text-primary tabular-nums">{globalRadius}px</span>
        </div>
        <input
          type="range"
          min={0} max={24} step={1} value={globalRadius}
          onChange={e => onRadiusChange(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer
            bg-muted/80
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-background
            [&::-webkit-slider-thumb]:shadow-md"
        />
      </div>

      {/* Party mode */}
      <button
        onClick={() => setIsPartyMode(!isPartyMode)}
        className={`w-full py-2.5 rounded-xl border-2 flex items-center justify-center gap-2 transition-all font-semibold text-xs ${
          isPartyMode
            ? 'border-primary bg-primary text-primary-foreground shadow-primary/20 shadow-lg'
            : 'border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
        }`}
      >
        {isPartyMode ? 'Party On!' : 'Party Mode'}
      </button>
    </div>
  );
}
