'use client';
import React from 'react';
import { LogoRaw } from './shared';

export default function Preview({ currentUser, displayUser }: any) {
  return (
        <div className="w-full h-full min-h-[320px] flex items-center justify-center">
          <LogoRaw colorize />
        </div>
      );

    // ── Layout ────────────────────────────────────────────────────────────────
}