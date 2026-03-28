'use client';
import React from 'react';
import { PDFProcessorRaw } from './shared';

export default function Preview({ currentUser, displayUser }: any) {
  return <div className="max-w-md mx-auto w-full"><PDFProcessorRaw /></div>;
}