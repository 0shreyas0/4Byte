'use client';

import React from 'react';
import { LibrarySidebar } from './Sidebar';

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-background min-h-[calc(100vh-6rem)]">
      <LibrarySidebar />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-12">
          {children}
        </div>
      </main>
    </div>
  );
}
