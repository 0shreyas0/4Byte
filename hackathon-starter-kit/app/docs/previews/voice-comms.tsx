'use client';
import React from 'react';
import { VoiceCommsRaw, BlurredPreview } from './shared';

export default function Preview({ currentUser, displayUser }: any) {
  const voiceContent = (
        <div className="w-full max-w-2xl mx-auto">
          <VoiceCommsRaw caseId="demo-case" currentUser={displayUser} />
        </div>
      );
      if (!currentUser) return <BlurredPreview>{voiceContent}</BlurredPreview>;
      return voiceContent;
}