import React, { useId, useState } from 'react';
import { cn } from '../../../utils/cn';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface SidebarGroupProps {
  label: string;
  children: React.ReactNode;
  isCollapsed?: boolean;
  surfaceScheme?: 'secondary' | 'background';
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export const SidebarGroup: React.FC<SidebarGroupProps> = ({
  label,
  children,
  isCollapsed,
  surfaceScheme = 'background',
  collapsible = false,
  defaultExpanded = true,
}) => {
  const groupId = useId();
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  const isExpanded = isCollapsed ? true : (collapsible ? isOpen : true);

  return (
    <div className="mb-4 flex flex-col gap-1 w-full">
      {!isCollapsed ? (
        <button
          type="button"
          onClick={() => {
            if (collapsible) setIsOpen((prev) => !prev);
          }}
          aria-expanded={isExpanded}
          aria-controls={groupId}
          className={cn(
            'px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis',
            'flex items-center justify-between gap-2 w-full text-left',
            collapsible && 'hover:text-foreground transition-colors',
          )}
        >
          <span className="truncate">{label}</span>
          {collapsible && (
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 transition-transform',
                isExpanded ? 'rotate-0' : '-rotate-90',
              )}
            />
          )}
        </button>
      ) : (
        <div className="mx-auto my-2 h-px w-8 bg-border" aria-hidden="true" />
      )}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={groupId}
            className="flex flex-col gap-1 w-full overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="flex flex-col gap-1 w-full">
              {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child, { isCollapsed, surfaceScheme } as any);
                }
                return child;
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
