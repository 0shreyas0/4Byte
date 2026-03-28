import React from 'react';
import Link from 'next/link';
import { cn } from '../../../utils/cn';
import { motion } from 'framer-motion';

interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
  surfaceScheme?: 'secondary' | 'background';
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  href, 
  active, 
  isCollapsed, 
  onClick,
  surfaceScheme = 'background',
}) => {
  const activePillClass = surfaceScheme === 'secondary'
    ? 'bg-background/80 border-border/60'
    : 'bg-secondary/80 border-border/60';

  const content = (
    <div className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-full transition-all duration-200 group cursor-pointer w-full relative outline-none focus-visible:ring-2 focus-visible:ring-primary",
      active ? "text-primary font-medium" : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
    )}>
      {active && (
        <motion.div 
          layoutId="sidebar-active-indicator"
          className={`absolute inset-0 border rounded-full shadow-sm -z-10 ${activePillClass}`}
          initial={false}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
      
      <div className={cn(
        "shrink-0 flex items-center justify-center transition-colors duration-200", 
        active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
      )}>
        {icon}
      </div>
      
      {!isCollapsed && (
        <span className="truncate flex-1 text-sm font-action">{label}</span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="w-full block outline-none" onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="w-full text-left outline-none block">
      {content}
    </button>
  );
};
