'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpenCheck, Palette, Bot, MessageCircle, Share2, ArrowRight } from 'lucide-react';

const SECTIONS = [
  {
    title: 'Architecture',
    description: 'The foundation of the kit. Modular layout, shared UI primitives, and feature-driven organization.',
    icon: BookOpenCheck,
    href: '/docs/button' // Jump to library as a starting point
  },
  {
    title: 'Theming',
    description: 'Dynamic CSS variables, HSL-based color systems, and reactive typography for deep customization.',
    icon: Palette,
    href: '/docs/theme-customizer'
  },
  {
    title: 'AI Utilities',
    description: 'Advanced chat interfaces, PDF processing, and voice control powered by elite agent hooks.',
    icon: Bot,
    href: '/docs/ai-chat'
  },
  {
    title: 'Collaboration',
    description: 'Real-time multi-user communication and optimistic UI patterns using Supabase.',
    icon: Share2,
    href: '/docs/team-chat'
  },
  {
    title: 'Component Library',
    description: 'Browse the full catalog of atomic components and feature modules with live previews.',
    icon: MessageCircle,
    href: '/docs/library'
  }
];

export default function DocsOverviewPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 space-y-20">
      {/* Hero */}
      <div className="space-y-6">
        <h1 className="text-h2 font-heading tracking-tight leading-tight max-w-3xl">
          Everything you need to <br />
          <span className="text-primary italic">ship elite products.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl font-body leading-relaxed">
          A modular framework designed for high-performance hackathon projects. 
          Zero boilerplate, pure implementation.
        </p>
      </div>

      {/* Minimalist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
        {SECTIONS.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link 
              href={section.href}
              className="group block space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <section.icon size={20} />
                </div>
                <h2 className="text-h3 font-heading flex items-center gap-2 group-hover:text-primary transition-colors">
                  {section.title}
                  <ArrowRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-light" />
                </h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-14">
                {section.description}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

