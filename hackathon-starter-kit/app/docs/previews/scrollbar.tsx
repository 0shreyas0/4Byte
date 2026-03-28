'use client';
import React from 'react';

export default function Preview({ currentUser, displayUser }: any) {
  return (
        <div className="w-full max-w-2xl mx-auto space-y-6 py-4">
          <p className="text-xs text-muted-foreground text-center font-bold uppercase tracking-widest">
            Hover over each panel to interact with the scrollbar
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Vertical */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Vertical</p>
              <div className="h-48 overflow-y-auto border border-border rounded-xl bg-card p-3 space-y-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-8 rounded-lg bg-secondary flex items-center px-3">
                    <span className="text-xs text-muted-foreground font-action">Item {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Horizontal */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Horizontal</p>
              <div className="overflow-x-auto border border-border rounded-xl bg-card p-3 h-48 flex items-center">
                <div className="flex gap-2" style={{ width: 'max-content' }}>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="w-20 h-20 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <span className="text-xs text-muted-foreground font-action">{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* no-scrollbar utility */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Hidden</p>
              <div className="h-48 overflow-y-auto no-scrollbar border border-border rounded-xl bg-card p-3 space-y-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-8 rounded-lg bg-secondary flex items-center px-3">
                    <span className="text-xs text-muted-foreground font-action">Item {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
}