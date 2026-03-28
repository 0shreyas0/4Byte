"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, UserPlus, FileEdit, Trash2, ArrowRight } from "lucide-react";
import { cn } from "../../utils/cn";

export interface ActivityEvent {
  id: string;
  user: { name: string; avatar?: string };
  action: "create" | "edit" | "delete" | "join";
  target: string;
  timestamp: string;
}

interface ActivityFeedProps {
  events: ActivityEvent[];
}

const ACTION_MAP = {
  create: { icon: UserPlus, color: "text-emerald-500", label: "created" },
  edit: { icon: FileEdit, color: "text-blue-500", label: "updated" },
  delete: { icon: Trash2, color: "text-rose-500", label: "removed" },
  join: { icon: Activity, color: "text-primary", label: "joined" },
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ events }) => {
  return (
    <div className="w-full max-w-sm bg-card/50 border border-border rounded-3xl overflow-hidden backdrop-blur-sm">
      <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-primary" />
          <h3 className="text-xs font-black uppercase tracking-widest">Live Activity</h3>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Feed Live" />
      </div>

      <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout" initial={false}>
          {events.map((event, idx) => {
            const config = ACTION_MAP[event.action];
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="group flex items-start gap-4 p-3 rounded-2xl hover:bg-primary/5 transition-colors cursor-default"
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-border bg-background transition-transform group-hover:scale-110 group-hover:rotate-3",
                  config.color.replace("text-", "bg-") + "/5"
                )}>
                  <config.icon size={18} className={config.color} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-foreground">
                      {event.user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {config.label}
                    </span>
                    <span className="text-xs font-bold text-primary truncate max-w-[100px]">
                      {event.target}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-muted-foreground/50 uppercase mt-1">
                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-40 transition-opacity mt-1" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
