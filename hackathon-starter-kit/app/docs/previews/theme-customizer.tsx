'use client';
import React from 'react';

export default function Preview({ currentUser, displayUser }: any) {
  return (
        <div className="flex items-center justify-center w-full py-12">
          <button 
            onClick={() => {
              const toggle = document.querySelector('[data-testid="customizer-toggle"]') as HTMLButtonElement;
              toggle?.click();
            }}
            className="group relative flex items-center justify-center w-24 h-24 rounded-full bg-primary text-primary-foreground shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-110 active:scale-95 border-b-4 border-primary/20"
          >
            <Palette size={40} className="group-hover:rotate-12 transition-transform duration-500" />
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </button>
        </div>
      );

    // ── Search & Data ─────────────────────────────────────────────────────────
}