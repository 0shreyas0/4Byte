"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/ui/utils/cn";
import { User } from "lucide-react";

interface PresenceIndicatorProps {
  users: Array<{
    id: string;
    name: string;
    avatar?: string;
    status?: "online" | "away" | "busy";
  }>;
  showName?: boolean;
  maxDisplay?: number;
}

export const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({ 
  users, 
  showName = false,
  maxDisplay = 5
}) => {
  const displayedUsers = users.slice(0, maxDisplay);
  const remainingCount = users.length - maxDisplay;

  return (
    <div className="flex items-center -space-x-2">
      <AnimatePresence mode="popLayout">
        {displayedUsers.map((user, idx) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 10 }}
            transition={{ delay: idx * 0.05 }}
            className="group relative"
          >
            <div className={cn(
              "w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden ring-2 ring-transparent transition-all group-hover:ring-primary/50 group-hover:z-10",
              user.status === "online" && "border-emerald-500/50"
            )}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User size={14} className="text-muted-foreground" />
              )}
            </div>
            
            {/* Status dot */}
            <div className={cn(
              "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-background",
              user.status === "online" ? "bg-emerald-500" : "bg-slate-400"
            )} />

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-[10px] font-bold rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20">
              {user.name}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {remainingCount > 0 && (
        <div className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-black text-muted-foreground z-0">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
