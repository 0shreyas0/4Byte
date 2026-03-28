'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeEngine } from './useThemeEngine';
import { ThemesPanel } from './themes/ThemesPanel';
import { ColorPanel } from './colors/ColorPanel';
import { TypographyPanel } from './typography/TypographyPanel';
import { CustomizerHeader, Tab } from './CustomizerHeader';
import { CustomizerToggle } from './CustomizerToggle';

export function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('themes');
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    theme, setTheme, mounted,
    activeColor, activeTheme, isPartyMode, setIsPartyMode,
    currentMode, allThemes,
    handleThemeChange, handleColorChange, handleRandomColor, handleCoolorsMode,
    saveCustomTheme, deleteCustomTheme,
    activeVar, setActiveVar,
    headingFont, bodyFont, actionFont,
    handleHeadingFontChange, handleBodyFontChange, handleActionFontChange,
    headingWeight, bodyWeight, actionWeight,
    handleHeadingWeightChange, handleBodyWeightChange, handleActionWeightChange,
    headingSize, bodySize, actionSize,
    handleHeadingSizeChange, handleBodySizeChange, handleActionSizeChange,
    globalRadius, handleRadiusChange,
  } = useThemeEngine();

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleTheme = (newTheme: string) => {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as Document & { startViewTransition: (cb: () => void) => void })
        .startViewTransition(() => setTheme(newTheme));
    } else {
      setTheme(newTheme);
    }
  };

  const onSave = () => { saveCustomTheme(newThemeName); setNewThemeName(''); setIsSaving(false); };

  if (!mounted) return null;

  return (
    <div ref={containerRef} className="fixed top-19 right-3 z-50">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.94, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -12 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="mb-4 rounded-3xl bg-popover/95 backdrop-blur-xl border border-border shadow-2xl w-88 overflow-hidden origin-top-right relative"
          >
            {/* Subtle gradient accent at top */}
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

            <div className="p-4">
              <CustomizerHeader activeTab={activeTab} setActiveTab={setActiveTab} onClose={() => setIsOpen(false)} />

              <div className="max-h-[calc(100vh-14rem)] overflow-y-auto pr-0.5 no-scrollbar">
                <AnimatePresence mode="wait">
                  {activeTab === 'themes' && (
                    <motion.div key="themes" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.18 }}>
                      <ThemesPanel
                        allThemes={allThemes} activeTheme={activeTheme} currentMode={currentMode}
                        isSaving={isSaving} newThemeName={newThemeName}
                        setIsSaving={setIsSaving} setNewThemeName={setNewThemeName}
                        saveCustomTheme={onSave} handleThemeChange={handleThemeChange}
                        deleteCustomTheme={deleteCustomTheme} handleCoolorsMode={handleCoolorsMode}
                      />
                    </motion.div>
                  )}
                  {activeTab === 'colors' && (
                    <motion.div key="colors" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.18 }}>
                      <ColorPanel
                        activeColor={activeColor} activeVar={activeVar} setActiveVar={setActiveVar}
                        isPartyMode={isPartyMode} setIsPartyMode={setIsPartyMode}
                        handleColorChange={handleColorChange} handleRandomColor={handleRandomColor}
                        currentThemeMode={theme} toggleTheme={toggleTheme}
                        globalRadius={globalRadius} onRadiusChange={handleRadiusChange}
                      />
                    </motion.div>
                  )}
                  {activeTab === 'typography' && (
                    <motion.div key="typography" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.18 }}>
                      <TypographyPanel
                        headingFont={headingFont} bodyFont={bodyFont} actionFont={actionFont}
                        handleHeadingFontChange={handleHeadingFontChange}
                        handleBodyFontChange={handleBodyFontChange}
                        handleActionFontChange={handleActionFontChange}
                        headingWeight={headingWeight} bodyWeight={bodyWeight} actionWeight={actionWeight}
                        onHeadingWeightChange={handleHeadingWeightChange}
                        onBodyWeightChange={handleBodyWeightChange}
                        onActionWeightChange={handleActionWeightChange}
                        headingSize={headingSize} bodySize={bodySize} actionSize={actionSize}
                        onHeadingSizeChange={handleHeadingSizeChange}
                        onBodySizeChange={handleBodySizeChange}
                        onActionSizeChange={handleActionSizeChange}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ) : (
          <CustomizerToggle onClick={() => setIsOpen(true)} isPartyMode={isPartyMode} />
        )}
      </AnimatePresence>
    </div>
  );
}
