'use client';
import React from 'react';
import { CodeSnippetRaw, DEMO_CODE } from './shared';

export default function Preview({ currentUser, displayUser }: any) {
  return (
        <div className="w-full max-w-xl mx-auto">
          <CodeSnippetRaw
            code={DEMO_CODE}
            language="typescript"
            background="background"
            windowVariant="mac"
            title="api/ai.ts"
          />
        </div>
      );
}