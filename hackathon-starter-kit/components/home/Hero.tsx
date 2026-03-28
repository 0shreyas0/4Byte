"use client";

import { motion } from "framer-motion";
import { Button } from "@/ui";
import { Github } from "lucide-react";
import Link from "next/link";

export function Hero({ scrollToTerminal }: { scrollToTerminal: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center text-center space-y-8 mb-24"
    >
      <div className="flex flex-col items-center gap-4">
         <h1 className="text-6xl md:text-7xl font-heading tracking-tighter leading-tight">
           Build Fast. <span className="bg-linear-to-r from-primary to-emerald-400 bg-clip-text text-transparent">Hack Faster.</span>
         </h1>
      </div>
      <p className="text-xl md:text-2xl font-body leading-relaxed text-muted-foreground max-w-3xl mx-auto">
        Not just a component library. HackKit is a <span className="text-foreground font-medium">developer framework</span> with a CLI ecosystem that installs production-ready full-stack features directly into your codebase.
      </p>
      <div className="flex items-center gap-4 bg-secondary/50 px-4 py-2 rounded-full border border-border animate-in fade-in slide-in-from-bottom-2 duration-1000">
        <span className="flex h-2 w-2 rounded-full bg-success animate-pulse"></span>
        <span className="text-xs font-action text-muted-foreground uppercase tracking-wider">Live on NPM</span>
        <span className="text-border">|</span>
        <a href="https://www.npmjs.com/package/create-hackkit-app" target="_blank" className="text-xs font-mono text-primary hover:underline">create-hackkit-app@0.0.2</a>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <Button size="lg" className="rounded-full px-10 h-14 text-lg font-action" onClick={scrollToTerminal}>
          Get Started
        </Button>
        <Button variant="outline" size="lg" className="rounded-full px-10 h-14 text-lg font-action" onClick={() => window.open('https://github.com/Pruthv-creates/hackathon-starter-kit', '_blank')}>
          <Github size={20} className="mr-2" /> GitHub
        </Button>
        <Link href="/docs">
          <Button variant="ghost" size="lg" className="rounded-full px-10 h-14 text-lg text-muted-foreground hover:text-foreground font-action w-full">
            View Docs
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
