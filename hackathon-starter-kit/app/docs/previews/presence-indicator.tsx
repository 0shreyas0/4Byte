'use client';
import React from 'react';
import { BlurredPreview, PresenceIndicatorWrapper } from './shared';

export default function Preview({ currentUser, displayUser }: any) {
  const presenceContent = (
        <div className="p-8 bg-secondary/10 rounded-2xl flex flex-col items-center gap-4">
          <PresenceIndicatorWrapper currentUser={displayUser} />
          <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Live Sync Active</p>
        </div>
      );
      if (!currentUser) return <BlurredPreview>{presenceContent}</BlurredPreview>;
      return presenceContent;
}