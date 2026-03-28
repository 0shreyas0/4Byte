"use client";

import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

interface CLITerminalProps {
  copied: boolean;
  onCopy: () => void;
  terminalRef: React.RefObject<HTMLElement | null>;
}

export function CLITerminal({ copied, onCopy, terminalRef }: CLITerminalProps) {
  return (
    <section ref={terminalRef as React.RefObject<HTMLDivElement>} className="mb-32">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="w-full max-w-3xl mx-auto"
      >
        <h2 className="text-2xl font-heading mb-6 text-center text-foreground">Initiate Development</h2>
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-primary to-accent rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-card rounded-xl border border-border overflow-hidden shadow-2xl">
            {/* macOS Header */}
            <div className="bg-secondary/50 px-4 py-3 flex items-center justify-between border-b border-border">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/50"></div>
                <div className="w-3 h-3 rounded-full bg-warning/50"></div>
                <div className="w-3 h-3 rounded-full bg-success/50"></div>
              </div>
              <div className="text-xs text-muted-foreground font-mono">zsh — hackkit</div>
              <button onClick={onCopy} className="text-muted-foreground hover:text-primary transition-colors">
                {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
              </button>
            </div>
            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm sm:text-base leading-relaxed overflow-x-auto bg-code-bg">
              <div className="flex gap-3 mb-2">
                <span className="text-primary">➜</span>
                <span className="text-primary/80">npx create-hackkit-app my-app</span>
              </div>
              <div className="flex gap-3 mb-4">
                <span className="text-primary">➜</span>
                <span className="text-primary/80">cd my-app</span>
              </div>
              <div className="flex gap-3 mb-2">
                <span className="text-primary">➜</span>
                <span className="text-primary/80">npx hackkit marketplace</span>
              </div>
              <div className="flex gap-3 mb-2">
                <span className="text-primary">➜</span>
                <span className="text-primary/80">npx hackkit add team-chat</span>
              </div>
              <div className="flex gap-3">
                <span className="text-primary">➜</span>
                <span className="text-primary/80">npx hackkit add ai-chat</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
