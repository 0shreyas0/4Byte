"use client";

import { motion } from "framer-motion";
import { Github, ShieldCheck, Monitor, Cpu } from "lucide-react";
import { Button } from "@/ui";

export function CTA({ scrollToTerminal }: { scrollToTerminal: () => void }) {
  return (
    <section className="mb-32">
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="p-16 rounded-[2.5rem] bg-secondary/30 backdrop-blur-sm border border-border text-center space-y-10 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        <div className="space-y-4">
          <h2 className="text-5xl font-heading tracking-tight text-foreground">Ready to build faster?</h2>
          <p className="text-xl text-muted-foreground font-body">Install HackKit today and dominate the next hackathon.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
           <Button size="lg" className="rounded-full px-12 h-16 text-xl font-action shadow-2xl shadow-primary/20" onClick={scrollToTerminal}>
             Get Started
           </Button>
           <Button variant="outline" size="lg" className="rounded-full px-12 h-16 text-xl font-action flex items-center gap-3" onClick={() => window.open('https://github.com/Pruthv-creates/hackathon-starter-kit', '_blank')}>
             <Github size={24} /> Star on GitHub
           </Button>
        </div>
        <div className="pt-10 flex items-center justify-center gap-12 text-muted-foreground text-sm font-action">
           <div className="flex items-center gap-2 tracking-widest uppercase"><ShieldCheck size={16} /> Production-Ready</div>
           <div className="flex items-center gap-2 tracking-widest uppercase"><Monitor size={16} /> Cross-Platform</div>
           <div className="flex items-center gap-2 tracking-widest uppercase"><Cpu size={16} /> Open Source</div>
        </div>
      </motion.div>
    </section>
  );
}
