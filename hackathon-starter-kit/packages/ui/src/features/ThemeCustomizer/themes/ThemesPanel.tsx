'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Wand2, BookmarkPlus } from 'lucide-react';
import { Theme } from '../types';
import { FONTS } from '../constants';

/** Returns short display name for a font ID, or a fallback */
function fontName(id?: string): string {
  if (!id) return '—';
  return FONTS.find(f => f.id === id)?.name ?? id;
}

/** The 7 semantic variables shown as swatches — matches the Coolors palette strip order */
const SWATCH_VARS: Array<keyof Theme['modes']['light']> = [
  'background', 'primary', 'card', 'accent', 'muted', 'border', 'foreground',
];

interface ThemeCardProps {
  theme: Theme;
  isActive: boolean;
  currentMode: 'light' | 'dark';
  isCustom: boolean;
  onSelect: () => void;
  onDelete?: () => void;
}

function ThemeCard({ theme, isActive, currentMode, isCustom, onSelect, onDelete }: ThemeCardProps) {
  const colors = theme.modes[currentMode];
  const typo = theme.typography;
  
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className={`relative cursor-pointer rounded-2xl border overflow-hidden transition-all duration-150 group ${
        isActive
          ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
          : 'border-border hover:border-primary/40 bg-card/50 hover:bg-accent/30'
      }`}
    >
      {/* 7-Color Palette Strip (Slim & Professional) */}
      <div className="flex h-6 border-b border-border/10">
        {SWATCH_VARS.map(v => (
          <div key={v} className="flex-1" style={{ backgroundColor: colors[v] }} />
        ))}
      </div>
      
      <div className="p-2.5 space-y-1">
        {/* Name & Persistence Controls */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 min-w-0">
            {theme.tag && <span className="text-xs shrink-0">{theme.tag}</span>}
            <span className="text-xs font-bold text-foreground truncate">{theme.name}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {isActive && <Check className="w-3 h-3 text-primary shrink-0" />}
            {isCustom && onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-destructive rounded transition-all"
                aria-label={`Delete ${theme.name}`}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Font Roles Row: Heading | Body | Code (Scrollable if overflowing) */}
        <div 
          className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground/80 overflow-x-auto whitespace-nowrap scrollbar-hide"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          <span className="shrink-0" title="Heading">{fontName(typo?.headingFont)}</span>
          <span className="opacity-30 shrink-0">|</span>
          <span className="shrink-0" title="Body">{fontName(typo?.bodyFont)}</span>
          <span className="opacity-30 shrink-0">|</span>
          <span className="shrink-0" title="Action/Code">{fontName(typo?.actionFont)}</span>
        </div>
      </div>
    </motion.div>
  );
}

interface ThemesPanelProps {
  allThemes: Theme[];
  activeTheme: string;
  currentMode: 'light' | 'dark';
  isSaving: boolean;
  newThemeName: string;
  setIsSaving: (v: boolean) => void;
  setNewThemeName: (v: string) => void;
  saveCustomTheme: () => void;
  handleThemeChange: (id: string) => void;
  deleteCustomTheme: (id: string) => void;
  handleCoolorsMode: () => void;
}

export function ThemesPanel({
  allThemes, activeTheme, currentMode,
  isSaving, newThemeName, setIsSaving, setNewThemeName,
  saveCustomTheme, handleThemeChange, deleteCustomTheme,
  handleCoolorsMode,
}: ThemesPanelProps) {
  const builtIn = allThemes.filter(t => !t.id.startsWith('custom-'));
  const custom  = allThemes.filter(t => t.id.startsWith('custom-'));

  return (
    <div className="space-y-4">
      {/* Magic Generate */}
      <button
        onClick={handleCoolorsMode}
        className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-action text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
      >
        <Wand2 className="w-3.5 h-3.5" /> Magic Generate
      </button>

      {/* Built-in themes grid */}
      <div>
        <p className="text-2xs font-action uppercase tracking-widest text-muted-foreground mb-2">Built-in</p>
        <div className="grid grid-cols-2 gap-2">
          {builtIn.map(t => (
            <ThemeCard
              key={t.id} theme={t} currentMode={currentMode}
              isActive={activeTheme === t.id} isCustom={false}
              onSelect={() => handleThemeChange(t.id)}
            />
          ))}
        </div>
      </div>

      {/* Custom / saved themes */}
      {(custom.length > 0 || activeTheme === 'custom-coolors') && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-2xs font-action uppercase tracking-widest text-muted-foreground">My Themes</p>
            {(!builtIn.some(t => t.id === activeTheme)) && !isSaving && (
              <button
                onClick={() => setIsSaving(true)}
                className="flex items-center gap-1 text-2xs text-primary font-action hover:underline"
              >
                <BookmarkPlus className="w-3 h-3" /> Save current
              </button>
            )}
          </div>

          {isSaving && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              className="space-y-2 mb-3 overflow-hidden"
            >
              <input
                autoFocus type="text" placeholder="Name this theme…"
                value={newThemeName} onChange={e => setNewThemeName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-accent border border-border focus:ring-1 ring-primary outline-none"
              />
              <div className="flex gap-2">
                <button onClick={saveCustomTheme} className="flex-1 text-xs py-1.5 bg-primary text-primary-foreground rounded-xl font-action">Save</button>
                <button onClick={() => setIsSaving(false)} className="px-4 text-xs py-1.5 bg-muted text-muted-foreground rounded-xl font-action">Cancel</button>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {custom.map(t => (
              <ThemeCard
                key={t.id} theme={t} currentMode={currentMode}
                isActive={activeTheme === t.id} isCustom
                onSelect={() => handleThemeChange(t.id)}
                onDelete={() => deleteCustomTheme(t.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
