'use client';
import React from 'react';
import { InputRaw } from './shared';

export default function Preview({ currentUser, displayUser }: any) {
  return (
        <div className="max-w-sm mx-auto w-full space-y-4">
          <InputRaw label="Email" placeholder="you@example.com" />
          <InputRaw label="Password" type="password" placeholder="••••••••" />
          <InputRaw label="Error state" placeholder="Invalid value" error="This field is required." />
        </div>
      );
}