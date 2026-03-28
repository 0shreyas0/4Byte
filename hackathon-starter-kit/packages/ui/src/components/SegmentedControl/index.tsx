'use client';

import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface SegmentedControlItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface SegmentedControlProps {
  items: SegmentedControlItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  ariaLabel?: string;
}

const SIZE_STYLES: Record<NonNullable<SegmentedControlProps['size']>, string> = {
  sm: 'h-8 text-xs px-3',
  md: 'h-9 text-sm px-4',
  lg: 'h-11 text-sm px-5',
};

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  items,
  value,
  defaultValue,
  onValueChange,
  size = 'md',
  orientation = 'horizontal',
  className,
  ariaLabel = 'Segmented control',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pillStyle, setPillStyle] = useState<
    { left: number; width: number } | { top: number; height: number } | null
  >(null);
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const isControlled = value !== undefined;
  const activeValue = isControlled ? value : internalValue;

  const activeItem = useMemo(
    () => items.find(item => item.value === activeValue && !item.disabled),
    [items, activeValue],
  );

  useLayoutEffect(() => {
    if (!containerRef.current || !activeItem) {
      setPillStyle(null);
      return;
    }

    const activeEl = itemRefs.current[activeItem.value];
    if (!activeEl) {
      setPillStyle(null);
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const itemRect = activeEl.getBoundingClientRect();

    if (orientation === 'vertical') {
      setPillStyle({
        top: itemRect.top - containerRect.top,
        height: itemRect.height,
      });
    } else {
      setPillStyle({
        left: itemRect.left - containerRect.left,
        width: itemRect.width,
      });
    }
  }, [activeItem, items, orientation]);

  const handleClick = (nextValue: string) => {
    if (!isControlled) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'relative inline-flex border border-border bg-secondary p-1',
        orientation === 'vertical' ? 'flex-col items-stretch' : 'items-center',
        orientation === 'vertical' ? 'rounded-2xl' : 'rounded-full',
        className,
      )}
    >
      <AnimatePresence initial={false}>
        {pillStyle && (
          <motion.span
            className={cn(
              'absolute bg-background shadow-sm',
              orientation === 'vertical' ? 'left-1 right-1' : 'top-1 bottom-1',
              orientation === 'vertical' ? 'rounded-xl' : 'rounded-full',
            )}
            initial={{ opacity: 0 }}
            animate={
              orientation === 'vertical'
                ? { opacity: 1, top: (pillStyle as { top: number }).top, height: (pillStyle as { height: number }).height }
                : { opacity: 1, left: (pillStyle as { left: number }).left, width: (pillStyle as { width: number }).width }
            }
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />
        )}
      </AnimatePresence>

      {items.map((item) => {
        const isActive = item.value === activeValue;
        return (
          <button
            key={item.value}
            ref={(el) => { itemRefs.current[item.value] = el; }}
            role="tab"
            aria-selected={isActive}
            aria-disabled={item.disabled}
            disabled={item.disabled}
            type="button"
            onClick={() => handleClick(item.value)}
            className={cn(
              'relative z-10 inline-flex items-center gap-2 rounded-full font-action transition-colors min-w-0',
              SIZE_STYLES[size],
              orientation === 'vertical' && 'w-full justify-start',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground',
              item.disabled && 'cursor-not-allowed text-muted-foreground/60 hover:text-muted-foreground/60',
            )}
          >
            {item.icon}
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
