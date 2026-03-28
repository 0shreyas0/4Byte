'use client';
import React from 'react';
import { LiveNotificationsRaw, BlurredPreview } from './shared';

export default function Preview({ currentUser, displayUser }: any) {
  const notificationsContent = (
        <div className="relative h-[400px] w-full border border-dashed border-border rounded-2xl bg-muted/5 p-8 overflow-hidden">
          <LiveNotificationsRaw 
            notifications={[
              { id: '1', type: 'info', title: 'System update', message: 'Encryption keys rotated 5s ago.', timestamp: new Date().toISOString() },
              { id: '2', type: 'success', title: 'Data sync', message: 'All files promoted to main canvas.', timestamp: new Date().toISOString() },
            ]}
            onDismiss={() => {}}
          />
          <div className="text-center text-muted-foreground/30 mt-20">
            <Sparkles size={48} className="mx-auto mb-4 opacity-10" />
            <p className="text-sm font-body">Notification stack preview</p>
          </div>
        </div>
      );
      if (!currentUser) return <BlurredPreview>{notificationsContent}</BlurredPreview>;
      return notificationsContent;
}