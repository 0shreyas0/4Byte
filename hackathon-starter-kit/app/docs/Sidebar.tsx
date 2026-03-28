'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { COMPONENT_REGISTRY, ComponentCategory } from '@/lib/registry';
import { Sidebar, SidebarGroup, SidebarItem } from '@/ui';

const CATEGORIES: ComponentCategory[] = ['Base UI', 'Layout', 'Auth', 'AI & Tools', 'Real-Time', 'Search & Data', 'Payment'];

export const LibrarySidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <Sidebar className="h-[calc(100vh-4rem)] min-h-0 sticky top-16">
      {CATEGORIES.map((category) => {
        const components = COMPONENT_REGISTRY.filter(c => c.category === category);
        if (components.length === 0) return null;

        const label = category === 'Real-Time' ? 'Real-Time' : category;

        return (
          <SidebarGroup key={category} label={label} collapsible defaultExpanded>
            {components.map((comp) => {
              const isActive = pathname === `/docs/${comp.id}`;
              return (
                <SidebarItem
                  key={comp.id}
                  href={`/docs/${comp.id}`}
                  active={isActive}
                  icon={<comp.icon size={16} />}
                  label={comp.name}
                />
              );
            })}
          </SidebarGroup>
        );
      })}
    </Sidebar>
  );
};
