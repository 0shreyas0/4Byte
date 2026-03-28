'use client';
import React from 'react';
import { PageTransitionRaw } from './shared';

export default function Preview({ currentUser, displayUser }: any) {
  return (
        <PageTransitionRaw>
          <div className="max-w-sm mx-auto p-6 rounded-2xl bg-card border border-border text-center space-y-2">
            <p className="font-heading">Page Transition</p>
            <p className="text-sm text-muted-foreground">This content faded &amp; slid in via Framer Motion.</p>
          </div>
        </PageTransitionRaw>
      );
}