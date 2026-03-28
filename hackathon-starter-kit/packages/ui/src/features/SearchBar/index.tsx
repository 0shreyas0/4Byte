'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ArrowRight, Hash } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { fuzzySearch } from '@/algorithms';
import { COMPONENT_REGISTRY } from '@/lib/registry';

// ── Types ────────────────────────────────────────────────────────────────────

export interface Item {
  _id: string;
  title: string;
  type?: string;
  category?: string;
  description?: string;
  href?: string;
}

interface SearchBarProps {
  onItemSelect?: (item: Item) => void;
  placeholder?: string;
  maxResults?: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildIndex(): Item[] {
  return COMPONENT_REGISTRY.map((c) => ({
    _id: c.id,
    title: c.name,
    category: c.category,
    description: c.description,
    href: `/docs/${c.id}`,
  }));
}

const INDEX = buildIndex();

function search(query: string, max: number): Item[] {
  if (!query.trim()) return [];
  return INDEX.map((item) => ({
    item,
    score: Math.max(
      fuzzySearch(query, item.title),
      item.description ? fuzzySearch(query, item.description) * 0.7 : 0,
      item.category ? fuzzySearch(query, item.category) * 0.5 : 0,
    ),
  }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((r) => r.item);
}

// ── Trigger button ────────────────────────────────────────────────────────────

interface TriggerProps {
  onClick: () => void;
  placeholder: string;
}

function SearchTrigger({ onClick, placeholder }: TriggerProps) {
  return (
    <button
      id="search-trigger"
      onClick={onClick}
      aria-label="Open search"
      className="group flex items-center gap-2.5 h-9 px-3 rounded-lg border border-border bg-muted/40 hover:bg-muted/70 hover:border-border/80 transition-all duration-150 text-muted-foreground min-w-[180px] max-w-[260px] w-full"
    >
      <Search size={14} className="shrink-0" />
      <span className="flex-1 text-left text-sm truncate">{placeholder}</span>
      <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-background border border-border text-muted-foreground/70 shrink-0">
        <span className="text-[11px]">⌘</span>K
      </kbd>
    </button>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

interface ModalProps {
  onClose: () => void;
  onItemSelect?: (item: Item) => void;
  maxResults: number;
}

function SearchModal({ onClose, onItemSelect, maxResults }: ModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Item[]>([]);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Run fuzzy search
  useEffect(() => {
    setResults(search(query, maxResults));
    setActive(0);
  }, [query, maxResults]);

  // Keyboard navigation
  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      if (e.key === 'Enter' && results[active]) {
        handleSelect(results[active]);
      }
    },
    [results, active, onClose],
  );

  const handleSelect = (item: Item) => {
    onItemSelect?.(item);
    onClose();
  };

  // Group by category
  const grouped = results.reduce<Record<string, Item[]>>((acc, item) => {
    const cat = item.category ?? 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const allResults = results; // flat list for keyboard index tracking
  let flatIndex = 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        className="relative w-full max-w-[560px] rounded-xl border border-border bg-card shadow-2xl shadow-black/20 overflow-hidden"
        onKeyDown={handleKey}
      >
        {/* Search input row */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-border">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            id="search-modal-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
          />
          <kbd
            onClick={onClose}
            className="cursor-pointer inline-flex items-center px-2 py-1 rounded text-[10px] font-mono bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[420px] overflow-y-auto">
          {query && results.length === 0 && (
            <div className="py-14 text-center">
              <p className="text-sm text-muted-foreground">
                No results for <span className="text-foreground font-medium">"{query}"</span>
              </p>
            </div>
          )}

          {!query && (
            <div className="py-10 text-center">
              <p className="text-xs text-muted-foreground/60 uppercase tracking-widest font-bold">
                Start typing to search components
              </p>
            </div>
          )}

          {query && results.length > 0 && (
            <div className="py-2">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  {/* Category label */}
                  <div className="flex items-center gap-2 px-4 py-2">
                    <Hash size={11} className="text-muted-foreground/50" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      {category}
                    </span>
                  </div>

                  {/* Items */}
                  {items.map((item) => {
                    const myIndex = flatIndex++;
                    return (
                      <button
                        key={item._id}
                        id={`search-result-${item._id}`}
                        onMouseEnter={() => setActive(myIndex)}
                        onClick={() => handleSelect(item)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          active === myIndex
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <span className="flex-1 text-sm font-medium">{item.title}</span>
                        {item.description && (
                          <span className="text-xs text-muted-foreground/60 truncate max-w-[180px] hidden sm:block">
                            {item.description}
                          </span>
                        )}
                        <ArrowRight
                          size={14}
                          className={`shrink-0 transition-opacity ${active === myIndex ? 'opacity-100' : 'opacity-0'}`}
                        />
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function SearchBar({
  onItemSelect,
  placeholder = 'Search components...',
  maxResults = 8,
}: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleSelect = (item: Item) => {
    onItemSelect?.(item);
    if (item.href) router.push(item.href);
  };

  return (
    <>
      <SearchTrigger onClick={() => setOpen(true)} placeholder={placeholder} />
      {open && (
        <SearchModal
          onClose={() => setOpen(false)}
          onItemSelect={handleSelect}
          maxResults={maxResults}
        />
      )}
    </>
  );
}
