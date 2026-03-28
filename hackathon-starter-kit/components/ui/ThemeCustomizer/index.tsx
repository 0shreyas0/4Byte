'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeEngine } from './useThemeEngine';
import { ColorPanel } from './colors/ColorPanel';
import { TypographyPanel } from './typography/TypographyPanel';
import { CustomizerHeader } from './CustomizerHeader';
import { CustomizerToggle } from './CustomizerToggle';

/**
 * ThemeCustomizer - Orchestrator for the theme customization floating panel.
 * Handles open/close state, tabs, and communicates with useThemeEngine for logic.
 */
export function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'colors' | 'typography'>('colors');

  const {
    theme,
    setTheme,
    mounted,
    activeColor,
    activeTheme,
    isPartyMode,
    setIsPartyMode,
    currentMode,
    allThemes,
    handleThemeChange,
    handleColorChange,
    handleRandomColor,
    handleCoolorsMode,
    saveCustomTheme,
    deleteCustomTheme,
    activeVar,
    setActiveVar,
    activeFont,
    handleFontChange
  } = useThemeEngine();

  // Handle local theme transitions and saving
  const toggleTheme = (newTheme: string) => {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      // @ts-ignore
      document.startViewTransition(() => setTheme(newTheme));
    } else {
      setTheme(newTheme);
    }
  };

  const onSave = () => {
    saveCustomTheme(newThemeName);
    setNewThemeName('');
    setIsSaving(false);
  };

  if (!mounted) return null;

  return (
    <div className="fixed top-24 right-6 z-50">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="mb-4 p-4 rounded-3xl bg-popover border border-border shadow-2xl w-80 overflow-hidden origin-top-right"
          >
            {/* Header with Tabs and Close Button */}
            <CustomizerHeader 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              onClose={() => setIsOpen(false)} 
            />

            {/* Scrollable Content Area */}
            <div className="max-h-[calc(100vh-16rem)] overflow-y-auto pr-1 no-scrollbar">
              <AnimatePresence mode="wait">
                {activeTab === 'colors' ? (
                  <motion.div
                    key="colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ColorPanel 
                      activeVar={activeVar}
                      setActiveVar={setActiveVar}
                      handleCoolorsMode={handleCoolorsMode}
                      currentThemeMode={theme}
                      toggleTheme={toggleTheme}
                      allThemes={allThemes}
                      activeThemeId={activeTheme}
                      currentMode={currentMode}
                      isSaving={isSaving}
                      newThemeName={newThemeName}
                      setIsSaving={setIsSaving}
                      setNewThemeName={setNewThemeName}
                      saveCustomTheme={onSave}
                      handleThemeChange={handleThemeChange}
                      deleteCustomTheme={deleteCustomTheme}
                      activeColor={activeColor}
                      isPartyMode={isPartyMode}
                      setIsPartyMode={setIsPartyMode}
                      handleColorChange={handleColorChange}
                      handleRandomColor={handleRandomColor}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="typography"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TypographyPanel 
                      activeFont={activeFont}
                      handleFontChange={handleFontChange}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          /* Floating Toggle Button */
          <CustomizerToggle 
            onClick={() => setIsOpen(true)} 
            isPartyMode={isPartyMode} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
