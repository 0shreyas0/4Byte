'use client';
import React from 'react';
import { ThemeTogglerRaw } from './shared';

export default function Preview({ currentUser, displayUser }: any) {
  return (
        <div className="flex items-center justify-center">
          <ThemeTogglerRaw />
        </div>
      );
}