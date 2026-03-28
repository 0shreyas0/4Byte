"use client";

import { motion } from "framer-motion";
import { Terminal as TerminalIcon, Search, ListFilter } from "lucide-react";
import { Card } from "@/ui";

export function CommandCenter() {
  return (
    <section className="mb-48">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div className="space-y-4">
          <h2 className="text-4xl font-heading">Command Center</h2>
          <p className="text-muted-foreground font-body">Manage your entire stack from the terminal.</p>
        </div>
        <div className="px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-mono font-bold">
          v0.0.2-stable
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2"
        >
          {/* Terminal UI */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl h-[500px]">
            <div className="bg-zinc-900/50 px-4 py-3 border-b border-zinc-800 flex justify-between items-center">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
              </div>
              <div className="text-xs text-zinc-500 font-mono">zsh — hackkit</div>
            </div>
            <div className="p-8 font-mono text-sm space-y-4">
              <div className="flex gap-3">
                <span className="text-primary">➜</span>
                <span className="text-zinc-100">hackkit marketplace</span>
              </div>
              <div className="text-zinc-500 italic">... fetching global module catalog</div>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="border border-zinc-800 p-4 rounded-xl bg-zinc-900/40">
                  <div className="text-primary font-bold mb-1">team-chat</div>
                  <div className="text-2xs text-zinc-500">WebSocket messaging</div>
                </div>
                <div className="border border-zinc-800 p-4 rounded-xl bg-zinc-900/40">
                  <div className="text-primary font-bold mb-1">auth-clerk</div>
                  <div className="text-2xs text-zinc-500">Next.js auth system</div>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-primary">➜</span>
                <span className="text-zinc-100 italic">hackkit add team-chat</span>
              </div>
              <div className="text-success flex gap-2">
                <span>[DONE]</span>
                <span>Module team-chat installed in /src/components/chat</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {[
            { icon: <TerminalIcon size={20} />, title: "Context-Aware CLI", desc: "Our CLI understands your project structure and only suggests compatible modules." },
            { icon: <Search size={20} />, title: "Code Discovery", desc: "Instantly find modules by name, category, or functionality directly from zsh." },
            { icon: <ListFilter size={20} />, title: "Dependency Sync", desc: "Automated dependency management keeps your /src and package.json perfectly in sync." }
          ].map((item, i) => (
            <Card key={i} className="p-6 bg-card/50 border-border hover:border-primary/50 transition-all rounded-3xl">
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-lg font-heading mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground font-body">{item.desc}</p>
                </div>
              </div>
            </Card>
          ))}
          <Card className="p-8 bg-linear-to-br from-primary to-accent text-primary-foreground rounded-3xl border-0 relative overflow-hidden group">
             <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-700">
               <TerminalIcon size={120} />
             </div>
             <h4 className="text-xl font-heading mb-2">Want to contribute?</h4>
             <p className="text-sm text-primary-foreground/80 mb-6 font-body">We're open source and always looking for new module creators.</p>
             <button className="px-6 py-2 bg-white text-black rounded-full font-action text-sm hover:bg-zinc-200 transition-colors">
               Submit Module
             </button>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
