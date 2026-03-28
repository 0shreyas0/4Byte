'use client';

import React, { useState } from 'react';
import { FONTS } from '../constants';
import { FontCategory } from '../types';

interface TypographyPanelProps {
  headingFont: string;
  bodyFont: string;
  actionFont: string;
  handleHeadingFontChange: (id: string) => void;
  handleBodyFontChange:    (id: string) => void;
  handleActionFontChange:  (id: string) => void;
  headingWeight: number;
  bodyWeight:    number;
  actionWeight:  number;
  onHeadingWeightChange: (w: number) => void;
  onBodyWeightChange:    (w: number) => void;
  onActionWeightChange:  (w: number) => void;
  headingSize: number;
  bodySize:    number;
  actionSize:  number;
  onHeadingSizeChange: (s: number) => void;
  onBodySizeChange:    (s: number) => void;
  onActionSizeChange:  (s: number) => void;
}

const CATEGORIES: { id: FontCategory; label: string }[] = [
  { id: 'sans',    label: 'Sans'    },
  { id: 'serif',   label: 'Serif'   },
  { id: 'mono',    label: 'Mono'    },
  { id: 'display', label: 'Display' },
];

/** Slim labelled slider */
function Slider({
  label, value, min, max, step, display, onChange
}: {
  label: string; value: number; min: number; max: number; step: number;
  display: string; onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-[8px] uppercase tracking-widest font-black text-muted-foreground/60">{label}</span>
        <span className="text-[9px] font-action text-primary tabular-nums">{display}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer
          bg-border
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-3
          [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-primary
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:shadow-sm"
      />
    </div>
  );
}

interface FontRowProps {
  roleLabel:    string;
  activeFont:   string;
  previewText:  string;
  previewStyle?: React.CSSProperties;
  onChange:     (id: string) => void;
  weight: number; onWeightChange: (w: number) => void;
  size:   number; onSizeChange:   (s: number) => void;
  weightLabel: string; sizeLabel: string;
}

function FontRow({
  roleLabel, activeFont, previewText, previewStyle,
  onChange, weight, onWeightChange, size, onSizeChange,
  weightLabel, sizeLabel,
}: FontRowProps) {
  const [cat, setCat] = useState<FontCategory>('sans');
  const preset   = FONTS.find(f => f.id === activeFont);
  const filtered = FONTS.filter(f => f.category === cat);

  const fontStyle: React.CSSProperties = {
    fontFamily:  preset?.family,
    fontWeight:  weight,
    fontSize:    `${size / 100}rem`,   // scale 1rem base by height %
    ...previewStyle,                   // role-specific overrides applied last
  };

  return (
    <div className="space-y-2.5 pb-4 border-b border-border/50 last:border-0 last:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground">{roleLabel}</span>
        <span className="text-[9px] font-action text-primary truncate max-w-[130px]">{preset?.label}</span>
      </div>

      {/* Preview box */}
      <div className="px-3 py-1.5 rounded-lg bg-accent/40 border border-border/40 overflow-hidden">
        <span className="block truncate text-sm text-foreground" style={fontStyle}>{previewText}</span>
      </div>

      {/* Sliders */}
      <div className="space-y-2 px-0.5">
        <Slider
          label="Weight"
          value={weight} min={100} max={900} step={100}
          display={weightLabel}
          onChange={onWeightChange}
        />
        <Slider
          label="Size"
          value={size} min={70} max={140} step={5}
          display={sizeLabel}
          onChange={onSizeChange}
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-1">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`flex-1 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all ${
              cat === c.id
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Font buttons */}
      <div className="flex flex-wrap gap-1.5">
        {filtered.map(f => (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            style={{ fontFamily: f.family }}
            className={`px-2.5 py-1 rounded-md text-[11px] transition-all border ${
              activeFont === f.id
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'border-border hover:bg-accent text-foreground'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TypographyPanel({
  headingFont, bodyFont, actionFont,
  handleHeadingFontChange, handleBodyFontChange, handleActionFontChange,
  headingWeight, bodyWeight, actionWeight,
  onHeadingWeightChange, onBodyWeightChange, onActionWeightChange,
  headingSize, bodySize, actionSize,
  onHeadingSizeChange, onBodySizeChange, onActionSizeChange,
}: TypographyPanelProps) {
  const headingPreset = FONTS.find(f => f.id === headingFont);
  const bodyPreset    = FONTS.find(f => f.id === bodyFont);
  const actionPreset  = FONTS.find(f => f.id === actionFont);

  return (
    <div className="space-y-4">
      {/* Composite live preview */}
      <div className="p-3 rounded-xl bg-accent/30 border border-border/50 space-y-1.5">
        <div className="text-[8px] uppercase tracking-[0.15em] text-muted-foreground font-black text-center mb-2">
          Live Preview
        </div>
        <div
          className="text-xl leading-none text-foreground"
          style={{ fontFamily: headingPreset?.family, fontWeight: headingWeight, fontSize: `${(headingSize / 100) * 1.5}rem` }}
        >
          Ag — Heading
        </div>
        <div
          className="text-muted-foreground"
          style={{ fontFamily: bodyPreset?.family, fontWeight: bodyWeight, fontSize: `${(bodySize / 100) * 0.875}rem` }}
        >
          The quick brown fox jumps over the lazy dog.
        </div>
        <div
          className="font-semibold uppercase tracking-wider text-primary"
          style={{ fontFamily: actionPreset?.family, fontWeight: actionWeight, fontSize: `${(actionSize / 100) * 0.65}rem` }}
        >
          BUTTON LABEL
        </div>
      </div>

      {/* Per-role rows */}
      <div className="space-y-4">
        <FontRow
          roleLabel="Headings"
          activeFont={headingFont}
          previewText="Ag — Bold Display"
          previewStyle={{ fontWeight: headingWeight }}
          onChange={handleHeadingFontChange}
          weight={headingWeight} onWeightChange={onHeadingWeightChange}
          weightLabel={String(headingWeight)}
          size={headingSize}    onSizeChange={onHeadingSizeChange}
          sizeLabel={`${headingSize}%`}
        />
        <FontRow
          roleLabel="Body Text"
          activeFont={bodyFont}
          previewText="The quick brown fox jumps over the lazy dog."
          previewStyle={{ fontWeight: bodyWeight }}
          onChange={handleBodyFontChange}
          weight={bodyWeight} onWeightChange={onBodyWeightChange}
          weightLabel={String(bodyWeight)}
          size={bodySize}    onSizeChange={onBodySizeChange}
          sizeLabel={`${bodySize}%`}
        />
        <FontRow
          roleLabel="UI & Actions"
          activeFont={actionFont}
          previewText="BUTTON LABEL"
          previewStyle={{ fontWeight: actionWeight, letterSpacing: '0.08em', textTransform: 'uppercase' }}
          onChange={handleActionFontChange}
          weight={actionWeight} onWeightChange={onActionWeightChange}
          weightLabel={String(actionWeight)}
          size={actionSize}    onSizeChange={onActionSizeChange}
          sizeLabel={`${actionSize}%`}
        />
      </div>
    </div>
  );
}
