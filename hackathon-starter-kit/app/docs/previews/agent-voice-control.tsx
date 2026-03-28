'use client';
import React from 'react';
import { AgentVoiceRaw } from './shared';

export default function Preview({ currentUser, displayUser }: any) {
  return (
        <div className="flex flex-col items-center gap-4">
          <AgentVoiceRaw />
          <p className="text-xs text-muted-foreground">Mic: Web Speech API · Speaker: TTS API</p>
        </div>
      );
}