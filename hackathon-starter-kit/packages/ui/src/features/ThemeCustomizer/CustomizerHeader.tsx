'use client';

import React from 'react';
import { Palette, Type, Layers, X } from 'lucide-react';
import { SegmentedControl } from '../../components/SegmentedControl';

export type Tab = 'themes' | 'colors' | 'typography';

interface CustomizerHeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onClose: () => void;
}

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'themes',     label: 'Themes',     icon: <Layers className="w-3 h-3" /> },
  { id: 'colors',     label: 'Colors',     icon: <Palette className="w-3 h-3" /> },
  { id: 'typography', label: 'Type',       icon: <Type className="w-3 h-3" /> },
];

export function CustomizerHeader({ activeTab, setActiveTab, onClose }: CustomizerHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <SegmentedControl
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as Tab)}
        size="sm"
        className="flex-1 mr-3"
        items={TABS.map(tab => ({
          value: tab.id,
          label: tab.label,
          icon: tab.icon,
        }))}
      />
      <button
        onClick={onClose}
        className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground shrink-0"
        aria-label="Close theme customizer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
