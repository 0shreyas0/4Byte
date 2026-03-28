'use client';
import React from 'react';
import { Home, Settings, Users } from 'lucide-react';
import { SegmentedControlRaw } from './shared';

export default function Preview({ currentUser, displayUser }: any) {
  const [segment, setSegment] = React.useState('overview');
  const [verticalSegment, setVerticalSegment] = React.useState('overview');

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 min-h-[180px]">
      <SegmentedControlRaw
        value={segment}
        onValueChange={setSegment}
        items={[
          { value: 'overview', label: 'Overview', icon: <Home size={16} /> },
          { value: 'team', label: 'Team', icon: <Users size={16} /> },
          { value: 'settings', label: 'Settings', icon: <Settings size={16} /> },
        ]}
      />
      <SegmentedControlRaw
        orientation="vertical"
        value={verticalSegment}
        onValueChange={setVerticalSegment}
        className="w-44"
        items={[
          { value: 'overview', label: 'Overview', icon: <Home size={16} /> },
          { value: 'team', label: 'Team', icon: <Users size={16} /> },
          { value: 'settings', label: 'Settings', icon: <Settings size={16} /> },
        ]}
      />
    </div>
  );
}
