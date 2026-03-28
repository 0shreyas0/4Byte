'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { GUEST_USER } from './previews/shared';

const previewMap: Record<string, any> = {
  'button': dynamic(() => import('./previews/button'), { ssr: false }),
  'card': dynamic(() => import('./previews/card'), { ssr: false }),
  'input': dynamic(() => import('./previews/input'), { ssr: false }),
  'segmented-control': dynamic(() => import('./previews/segmented-control'), { ssr: false }),
  'code-snippet': dynamic(() => import('./previews/code-snippet'), { ssr: false }),
  'theme-toggler': dynamic(() => import('./previews/theme-toggler'), { ssr: false }),
  'user-profile': dynamic(() => import('./previews/user-profile'), { ssr: false }),
  'page-transition': dynamic(() => import('./previews/page-transition'), { ssr: false }),
  'logo': dynamic(() => import('./previews/logo'), { ssr: false }),
  'navbar': dynamic(() => import('./previews/navbar'), { ssr: false }),
  'sidebar': dynamic(() => import('./previews/sidebar'), { ssr: false }),
  'footer': dynamic(() => import('./previews/footer'), { ssr: false }),
  'log-in': dynamic(() => import('./previews/log-in'), { ssr: false }),
  'presence-indicator': dynamic(() => import('./previews/presence-indicator'), { ssr: false }),
  'typing-indicator': dynamic(() => import('./previews/typing-indicator'), { ssr: false }),
  'realtime-cursor': dynamic(() => import('./previews/realtime-cursor'), { ssr: false }),
  'live-notifications': dynamic(() => import('./previews/live-notifications'), { ssr: false }),
  'activity-feed': dynamic(() => import('./previews/activity-feed'), { ssr: false }),
  'collaborative-editor': dynamic(() => import('./previews/collaborative-editor'), { ssr: false }),
  'ai-chat': dynamic(() => import('./previews/ai-chat'), { ssr: false }),
  'ai-demo': dynamic(() => import('./previews/ai-demo'), { ssr: false }),
  'agent-voice-control': dynamic(() => import('./previews/agent-voice-control'), { ssr: false }),
  'pdf-processor': dynamic(() => import('./previews/pdf-processor'), { ssr: false }),
  'scraper-service': dynamic(() => import('./previews/scraper-service'), { ssr: false }),
  'team-chat': dynamic(() => import('./previews/team-chat'), { ssr: false }),
  'voice-comms': dynamic(() => import('./previews/voice-comms'), { ssr: false }),
  'theme-customizer': dynamic(() => import('./previews/theme-customizer'), { ssr: false }),
  'scrollbar': dynamic(() => import('./previews/scrollbar'), { ssr: false }),
  'search-bar': dynamic(() => import('./previews/search-bar'), { ssr: false }),
  'razorpay-button': dynamic(() => import('./previews/razorpay-button'), { ssr: false })
};

export const ComponentPreview: React.FC<{ id: string }> = ({ id }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="p-12 text-center text-muted-foreground animate-pulse font-black uppercase tracking-widest">Initialising Operative...</div>;

  const currentUser = user ? {
    id: user.id,
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || "Operative",
    avatar: user.user_metadata?.avatar_url
  } : null;

  const displayUser = currentUser || GUEST_USER;

  const PreviewComp = previewMap[id];
  if (!PreviewComp) {
    return (
      <div className="p-12 text-center bg-muted/20 border border-dashed border-border rounded-2xl">
        <p className="text-muted-foreground italic">Preview not available for this component ID.</p>
      </div>
    );
  }

  return <PreviewComp currentUser={currentUser} displayUser={displayUser} />;
};