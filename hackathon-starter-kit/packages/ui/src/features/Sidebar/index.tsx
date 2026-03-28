'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  className?: string;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  surfaceScheme?: 'secondary' | 'background';
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  className, 
  children, 
  defaultCollapsed = false,
  surfaceScheme = 'background',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const sidebarBgClass = surfaceScheme === 'secondary' ? 'bg-secondary/80' : 'bg-background/80';

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 260 }}
      className={cn(
        `relative flex flex-col h-full min-h-screen ${sidebarBgClass} backdrop-blur-md border-r border-border shrink-0 z-40 transition-shadow`,
        className
      )}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-accent text-muted-foreground hover:text-primary transition-colors z-50 focus:outline-none"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <div className="flex-1 overflow-y-auto no-scrollbar py-6 flex flex-col gap-2 px-3 relative">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { isCollapsed, surfaceScheme } as any);
          }
          return child;
        })}
      </div>
    </motion.aside>
  );
};

export * from './components/SidebarItem';
export * from './components/SidebarGroup';
