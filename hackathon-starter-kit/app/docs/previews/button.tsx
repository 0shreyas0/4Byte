'use client';
import React from 'react';
import { ButtonRaw } from './shared';

export default function Preview({ currentUser, displayUser }: any) {
  return (
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <ButtonRaw>Primary</ButtonRaw>
          <ButtonRaw variant="outline">Outline</ButtonRaw>
          <ButtonRaw variant="ghost">Ghost</ButtonRaw>
          <ButtonRaw loading>Loading</ButtonRaw>
          <ButtonRaw disabled>Disabled</ButtonRaw>
        </div>
      );
}