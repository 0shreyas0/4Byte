"use client";

import { motion } from "framer-motion";
import { Check, Terminal, Cloud, Code2, ArrowDown, Rocket } from "lucide-react";

export function ArchitectureDiagram() {
  return (
    <section className="mb-48">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="p-12 md:p-20 rounded-[3rem] bg-card border border-border relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-heading leading-tight">Elite Platform <span className="text-primary italic">Architecture</span></h2>
            <div className="space-y-6">
              {[
                { title: "CLI First", desc: "A unified terminal experience to manage your lifecycle." },
                { title: "Cloud Registry", desc: "Real-time sync with our global module catalog." },
                { title: "Source-Code Delivery", desc: "We don't hide code in node_modules. We install raw source code directly into your /src folder." },
                { title: "Full Customization", desc: "Modify, extend, and own the features you install." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Check size={12} />
                  </div>
                  <div>
                    <h5 className="font-heading">{item.title}</h5>
                    <p className="text-sm text-muted-foreground font-body">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
             {/* Visual Diagram */}
             <div className="flex flex-col items-center gap-8">
                <div className="w-full p-4 rounded-xl bg-secondary border border-border flex items-center justify-center text-primary gap-3 shadow-xl">
                  <Terminal size={20} /> <span className="font-mono text-sm">CLI Environment</span>
                </div>
                <ArrowDown className="text-primary/20" />
                <div className="w-full p-4 rounded-xl bg-secondary border border-border flex items-center justify-center text-info gap-3 shadow-xl">
                  <Cloud size={20} /> <span className="font-mono text-sm">Remote Registry</span>
                </div>
                <ArrowDown className="text-primary/20" />
                <div className="w-full p-4 rounded-xl bg-secondary border border-border flex items-center justify-center text-primary gap-3 shadow-xl">
                  <Code2 size={20} /> <span className="font-mono text-sm">Module Templates</span>
                </div>
                <ArrowDown className="text-primary/20" />
                <div className="w-full p-6 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-foreground gap-3 shadow-[0_0_50px_rgba(var(--primary),0.1)]">
                  <Rocket size={24} className="text-primary" /> <span className="font-action">Your Next.js App</span>
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
