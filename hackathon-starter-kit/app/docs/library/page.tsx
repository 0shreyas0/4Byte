'use client';

import React from 'react';
import Link from 'next/link';
import { COMPONENT_REGISTRY } from '@/lib/registry';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function ComponentLibraryPage() {
  return (
    <div className="space-y-12 pb-24">
      <div className="space-y-4 text-center py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
          <Sparkles size={12} />
          Component Library
        </div>
        <h1 className="text-h1 font-heading tracking-tighter">
          Premium Components for <br /> <span className="text-primary italic">Elite Agents</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body leading-relaxed">
          Browse the modular architecture and interactive previews of the built‑in UI, AI, and data components.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {COMPONENT_REGISTRY.map((comp, idx) => (
          <Link key={comp.id} href={`/docs/${comp.id}`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group h-full bg-muted/20 border border-border rounded-3xl p-8 transition-all hover:bg-background hover:shadow-2xl hover:shadow-primary/5 cursor-pointer relative overflow-hidden"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <comp.icon size={24} />
                </div>

                <h3 className="text-h3 font-heading mb-2 flex items-center gap-2">
                  {comp.name}
                  <ArrowRight
                    size={16}
                    className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary"
                  />
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {comp.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/50">
                    {comp.category}
                  </span>
                  <div className="flex gap-1">
                    {comp.modularStructure.slice(0, 3).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative Mesh Gradient Background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -mr-32 -mt-32 group-hover:bg-primary/10 transition-colors" />
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

