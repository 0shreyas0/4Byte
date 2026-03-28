import React from 'react';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';

interface CustomizerToggleProps {
  onClick: () => void;
  isPartyMode: boolean;
}

export function CustomizerToggle({ onClick, isPartyMode }: CustomizerToggleProps) {
  return (
    <motion.button
      key="button"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.1, rotate: 10 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      data-testid="customizer-toggle"
      className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-2xl border-4 border-background flex items-center justify-center group"
      style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)' }}
    >
      <Palette className={`w-6 h-6 transition-transform group-hover:scale-110 ${isPartyMode ? 'animate-bounce' : ''}`} />
    </motion.button>
  );
}
