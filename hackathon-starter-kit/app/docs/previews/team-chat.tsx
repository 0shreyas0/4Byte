'use client';
import React from 'react';
import { TeamChatRaw, BlurredPreview } from './shared';

export default function Preview({ currentUser, displayUser }: any) {
  const chatContent = <div className="w-full max-w-4xl mx-auto"><TeamChatRaw currentUser={displayUser} /></div>;
      if (!currentUser) return <BlurredPreview>{chatContent}</BlurredPreview>;
      return chatContent;
}