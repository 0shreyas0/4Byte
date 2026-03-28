'use client';
import React from 'react';

export default function Preview({ currentUser, displayUser }: any) {
  return (
        <div className="flex border border-border rounded-xl bg-card overflow-hidden w-full max-w-lg mx-auto shadow-sm relative z-10 h-[500px]">
          <LibrarySidebar />
          <div className="p-6 text-sm text-muted-foreground flex flex-col items-center justify-center flex-1">
            Component Area
          </div>
        </div>
      );
}