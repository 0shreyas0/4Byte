"use client";

import React from "react";
import { motion } from "framer-motion";
import { MousePointer2 } from "lucide-react";

interface CursorProps {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
}

export const RealtimeCursor: React.FC<CursorProps> = ({ name, x, y, color }) => {
  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      animate={{ x: `${x}vw`, y: `${y}vh` }}
      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
    >
      <MousePointer2 
        size={20} 
        style={{ color, fill: color }} 
        className="drop-shadow-lg"
      />
      <div 
        className="ml-4 px-2 py-0.5 rounded-full text-[10px] font-black text-white shadow-xl whitespace-nowrap"
        style={{ backgroundColor: color }}
      >
        {name}
      </div>
    </motion.div>
  );
};
