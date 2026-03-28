'use client';
import React from 'react';
import { CollaborativeEditorRaw, BlurredPreview } from './shared';

export default function Preview({ currentUser, displayUser }: any) {
  const editorContent = (
        <div className="w-full py-8">
          <CollaborativeEditorRaw 
            docId="demo-collab" 
            userId={displayUser.id} 
            userName={displayUser.name} 
            title="Global Investigation Briefing"
          />
        </div>
      );
      if (!currentUser) return <BlurredPreview>{editorContent}</BlurredPreview>;
      return editorContent;

    // ── AI & Tools ────────────────────────────────────────────────────────────
}