'use client';
import React from 'react';
import { AIDemoRaw } from './shared';

export default function Preview({ currentUser, displayUser }: any) {
  return (
        <div className="max-w-md mx-auto w-full p-4 rounded-2xl bg-card border border-border">
          <AIDemoRaw />
        </div>
      );
}