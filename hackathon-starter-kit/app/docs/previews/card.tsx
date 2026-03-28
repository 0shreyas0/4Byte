'use client';
import React from 'react';
import { CardRaw } from './shared';

export default function Preview({ currentUser, displayUser }: any) {
  return (
        <div className="w-full flex items-center justify-center">
          <CardRaw className="max-w-sm w-full">
            <div className="p-6 space-y-2">
              <h3 className="font-heading text-base">Card Component</h3>
              <p className="text-sm text-muted-foreground">A clean container for grouping related content and actions.</p>
            </div>
          </CardRaw>
        </div>
      );
}