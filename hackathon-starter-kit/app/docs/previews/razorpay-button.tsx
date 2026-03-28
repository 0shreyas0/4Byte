'use client';
import React from 'react';
import { RazorpayRaw } from './shared';

export default function Preview({ currentUser, displayUser }: any) {
  return (
        <div className="flex flex-col items-center gap-4">
          <RazorpayRaw amount={499} name="Hackathon Kit" description="Premium starter kit license" />
          <p className="text-xs text-muted-foreground">Uses Razorpay SDK · Requires API keys in .env</p>
        </div>
      );
}