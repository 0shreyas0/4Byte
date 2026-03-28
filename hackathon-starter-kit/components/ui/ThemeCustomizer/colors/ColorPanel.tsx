import React from 'react';
import { Wand2 } from 'lucide-react';
import { PalettePreview } from './PalettePreview';
import { ModeSelector } from './ModeSelector';
import { ThemeLibrary } from './ThemeLibrary';
import { ColorPalette } from './ColorPalette';
import { Theme } from '../types';

interface ColorPanelProps {
  activeVar: string;
  setActiveVar: (name: string) => void;
  handleCoolorsMode: () => void;
  currentThemeMode: string | undefined;
  toggleTheme: (mode: string) => void;
  allThemes: Theme[];
  activeThemeId: string;
  currentMode: 'light' | 'dark';
  isSaving: boolean;
  newThemeName: string;
  setIsSaving: (saving: boolean) => void;
  setNewThemeName: (name: string) => void;
  saveCustomTheme: () => void;
  handleThemeChange: (id: string) => void;
  deleteCustomTheme: (id: string) => void;
  activeColor: string;
  isPartyMode: boolean;
  setIsPartyMode: (active: boolean) => void;
  handleColorChange: (color: string) => void;
  handleRandomColor: () => void;
}

export function ColorPanel({
  activeVar,
  setActiveVar,
  handleCoolorsMode,
  currentThemeMode,
  toggleTheme,
  allThemes,
  activeThemeId,
  currentMode,
  isSaving,
  newThemeName,
  setIsSaving,
  setNewThemeName,
  saveCustomTheme,
  handleThemeChange,
  deleteCustomTheme,
  activeColor,
  isPartyMode,
  setIsPartyMode,
  handleColorChange,
  handleRandomColor,
}: ColorPanelProps) {
  return (
    <div className="space-y-6">
      <PalettePreview activeVar={activeVar} setActiveVar={setActiveVar} />

      <div className="flex gap-2 mb-6">
        <button
          onClick={handleCoolorsMode}
          className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground font-action tracking-action text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95"
        >
          <Wand2 className="w-3.5 h-3.5" />
          Generate Theme
        </button>
      </div>

      <ModeSelector currentTheme={currentThemeMode} toggleTheme={toggleTheme} />
      
      <ThemeLibrary 
        allThemes={allThemes}
        activeTheme={activeThemeId}
        currentMode={currentMode}
        isSaving={isSaving}
        newThemeName={newThemeName}
        setIsSaving={setIsSaving}
        setNewThemeName={setNewThemeName}
        saveCustomTheme={saveCustomTheme}
        handleThemeChange={handleThemeChange}
        deleteCustomTheme={(e, id) => deleteCustomTheme(id)}
      />

      <ColorPalette 
        activeColor={activeColor}
        activeVar={activeVar}
        isPartyMode={isPartyMode}
        handleColorChange={handleColorChange}
        handleRandomColor={handleRandomColor}
      />

      <button
        onClick={() => setIsPartyMode(!isPartyMode)}
        className={`w-full py-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all font-heading text-xs uppercase tracking-action ${
          isPartyMode 
            ? 'border-primary bg-primary text-primary-foreground shadow-[0_0_20px_-5px_var(--primary)]' 
            : 'border-dashed border-border text-muted-foreground hover:border-primary hover:text-foreground'
        }`}
      >
        <div className={`w-3 h-3 rounded-full ${isPartyMode ? 'bg-white' : 'bg-muted'} shadow-sm`} />
        {isPartyMode ? 'Party On!! 🌈' : 'Start Party Mode'}
      </button>
    </div>
  );
}
