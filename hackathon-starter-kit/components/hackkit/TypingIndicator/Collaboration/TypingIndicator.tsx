"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquareMore } from "lucide-react";

interface TypingIndicatorProps {
  typingUsers: string[];
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  if (typingUsers.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary uppercase tracking-widest"
      >
        <MessageSquareMore size={12} className="animate-pulse" />
        <div className="flex gap-1 items-center">
          <span className="max-w-[100px] truncate">
            {typingUsers.length === 1 
              ? typingUsers[0] 
              : `${typingUsers.length} people`}
          </span>
          <span>{typingUsers.length === 1 ? 'is' : 'are'} typing</span>
          <div className="flex gap-0.5 ml-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                className="w-1 h-1 rounded-full bg-primary"
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
