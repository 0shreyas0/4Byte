import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Theme } from '../types';

interface ThemeLibraryProps {
  allThemes: Theme[];
  activeTheme: string;
  currentMode: 'light' | 'dark';
  isSaving: boolean;
  newThemeName: string;
  setIsSaving: (saving: boolean) => void;
  setNewThemeName: (name: string) => void;
  saveCustomTheme: () => void;
  handleThemeChange: (id: string) => void;
  deleteCustomTheme: (e: React.MouseEvent, id: string) => void;
}

export function ThemeLibrary({
  allThemes,
  activeTheme,
  currentMode,
  isSaving,
  newThemeName,
  setIsSaving,
  setNewThemeName,
  saveCustomTheme,
  handleThemeChange,
  deleteCustomTheme
}: ThemeLibraryProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-2xs font-heading uppercase tracking-action text-muted-foreground">Themes</p>
        {activeTheme === 'custom-coolors' && !isSaving && (
          <button 
            onClick={() => setIsSaving(true)}
            className="text-3xs font-heading text-primary hover:underline"
          >
            Save to Library
          </button>
        )}
      </div>

      {isSaving && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="space-y-2 overflow-hidden"
        >
          <input 
            type="text"
            placeholder="Theme name..."
            value={newThemeName}
            onChange={(e) => setNewThemeName(e.target.value)}
            className="w-full text-2xs px-2 py-1.5 rounded-lg bg-accent border-none focus:ring-1 ring-primary outline-none"
            autoFocus
          />
          <div className="flex gap-2">
             <button 
               onClick={saveCustomTheme}
               className="flex-1 text-3xs font-heading py-1 bg-primary text-primary-foreground rounded-lg"
             >
               Save Theme
             </button>
             <button 
               onClick={() => setIsSaving(false)}
               className="px-3 text-3xs font-heading py-1 bg-accent rounded-lg"
             >
               Cancel
             </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
        {allThemes.map((t) => (
          <div
            key={t.id}
            onClick={() => handleThemeChange(t.id)}
            className={`group/item flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
              activeTheme === t.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <div 
                className="w-3 h-3 rounded-full border border-border shadow-sm shrink-0"
                style={{ backgroundColor: t.modes[currentMode]?.background || 'var(--foreground)' }}
              />
              <span className="text-xs font-action tracking-action truncate">{t.name}</span>
            </div>
            {t.id.startsWith('custom-') && (
              <button 
                onClick={(e) => deleteCustomTheme(e, t.id)}
                className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-all"
                aria-label={`Delete ${t.name} theme`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
