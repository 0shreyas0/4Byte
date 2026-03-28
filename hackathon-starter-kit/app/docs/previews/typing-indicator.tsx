'use client';
import React from 'react';
import { BlurredPreview, TypingIndicatorWrapper } from './shared';

export default function Preview({ currentUser, displayUser }: any) {
  const typingContent = (
        <div className="p-12 flex justify-center">
          <TypingIndicatorWrapper currentUser={displayUser} />
        </div>
      );
      if (!currentUser) return <BlurredPreview>{typingContent}</BlurredPreview>;
      return typingContent;
}