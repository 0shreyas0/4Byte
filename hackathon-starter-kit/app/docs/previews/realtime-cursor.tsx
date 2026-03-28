'use client';
import React from 'react';
import { BlurredPreview, RealtimeCursorWrapper } from './shared';

export default function Preview({ currentUser, displayUser }: any) {
  const cursorContent = (
        <div className="relative w-full h-[400px] border border-dashed border-border/30 rounded-3xl bg-primary/5 flex items-center justify-center overflow-hidden cursor-crosshair group">
          <RealtimeCursorWrapper currentUser={displayUser} />
          <div className="text-center space-y-2 select-none opacity-20 group-hover:opacity-40 transition-opacity">
            <Bot size={48} className="mx-auto" />
            <p className="text-xs font-black uppercase tracking-widest leading-loose">
              Hover to broadcast position<br />
              <span className="text-primary italic">Friend's cursors will appear here</span>
            </p>
          </div>
        </div>
      );
      if (!currentUser) return <BlurredPreview>{cursorContent}</BlurredPreview>;
      return cursorContent;
}