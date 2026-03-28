"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "../../utils/cn";

export interface Notification {
  id: string;
  type: "info" | "success" | "warning";
  title: string;
  message: string;
  timestamp: string;
}

interface LiveNotificationsProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export const LiveNotifications: React.FC<LiveNotificationsProps> = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            layout
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className={cn(
              "w-80 pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-xl relative overflow-hidden group",
              notif.type === "success" ? "bg-emerald-500/10 border-emerald-500/20" :
              notif.type === "warning" ? "bg-amber-500/10 border-amber-500/20" :
              "bg-primary/10 border-primary/20"
            )}
          >
            {/* Ambient background glow */}
            <div className={cn(
              "absolute inset-0 opacity-10 blur-xl -z-10",
              notif.type === "success" ? "bg-emerald-500" :
              notif.type === "warning" ? "bg-amber-500" :
              "bg-primary"
            )} />

            <div className="flex gap-3">
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                notif.type === "success" ? "bg-emerald-500 text-white" :
                notif.type === "warning" ? "bg-amber-500 text-white" :
                "bg-primary text-white"
              )}>
                {notif.type === "success" ? <CheckCircle size={16} /> :
                 notif.type === "warning" ? <AlertTriangle size={16} /> :
                 <Info size={16} />}
              </div>

              <div className="flex-1 space-y-1">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground">
                  {notif.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {notif.message}
                </p>
                <span className="text-[8px] font-bold text-muted-foreground/50 uppercase">
                  {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <button 
                onClick={() => onDismiss(notif.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded-lg text-muted-foreground"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
