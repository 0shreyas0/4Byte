'use client';
import React from 'react';
import { ActivityFeedRaw, BlurredPreview } from './shared';

export default function Preview({ currentUser, displayUser }: any) {
  const feedContent = (
        <div className="flex justify-center p-8">
          <ActivityFeedRaw 
            events={[
              { id: '1', user: { name: 'Commander PR' }, action: 'join', target: 'HQ Channel', timestamp: new Date().toISOString() },
              { id: '2', user: { name: 'Alex Agent' }, action: 'edit', target: 'Budget.pdf', timestamp: new Date().toISOString() },
              { id: '3', user: { name: 'Sarah Dev' }, action: 'create', target: 'New Thread', timestamp: new Date().toISOString() },
            ]} 
          />
        </div>
      );
      if (!currentUser) return <BlurredPreview>{feedContent}</BlurredPreview>;
      return feedContent;
}