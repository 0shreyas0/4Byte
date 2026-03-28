import React from 'react';
import { Palette, Type, X } from 'lucide-react';
import { SegmentedControl } from '@/ui/components/SegmentedControl';

interface CustomizerHeaderProps {
  activeTab: 'colors' | 'typography';
  setActiveTab: (tab: 'colors' | 'typography') => void;
  onClose: () => void;
}

export function CustomizerHeader({ activeTab, setActiveTab, onClose }: CustomizerHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <SegmentedControl
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as CustomizerHeaderProps['activeTab'])}
        size="sm"
        className="w-full mr-4"
        items={[
          { value: 'colors', label: 'Colors', icon: <Palette className="w-3 h-3" /> },
          { value: 'typography', label: 'Typography', icon: <Type className="w-3 h-3" /> },
        ]}
      />
      <button 
        onClick={onClose}
        className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground shrink-0"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
