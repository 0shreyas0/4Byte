'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from 'next-themes';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Minus, Square, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface CodeSnippetProps {
  code: string;
  language?: string;
  inline?: boolean;
  className?: string;
  /**
   * Uses app background when set to "background", otherwise uses the code theme background.
   */
  background?: 'theme' | 'background';
  /**
   * Optional window chrome style.
   */
  windowVariant?: 'none' | 'mac' | 'windows' | 'linux';
  /**
   * Optional window title (shown when windowVariant !== 'none').
   */
  title?: string;
}

const THEME_BG = {
  light: '#eff1f5',
  dark: '#1e1e2e',
};

const WindowControls = ({ variant }: { variant: CodeSnippetProps['windowVariant'] }) => {
  if (variant === 'mac') {
    return (
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57] border border-[#ff5f57]/20" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e] border border-[#febc2e]/20" />
        <span className="h-3 w-3 rounded-full bg-[#28c840] border border-[#28c840]/20" />
      </div>
    );
  }
  if (variant === 'windows') {
    return (
      <div className="flex items-center gap-3">
        <Minus className="w-3.5 h-3.5 text-muted-foreground/70 hover:text-foreground transition-colors cursor-pointer" />
        <Square className="w-3 h-3 text-muted-foreground/70 hover:text-foreground transition-colors cursor-pointer" />
        <X className="w-3.5 h-3.5 text-muted-foreground/70 hover:text-red-500 transition-colors cursor-pointer" />
      </div>
    );
  }
  if (variant === 'linux') {
    return (
      <div className="flex items-center gap-1.5 pl-1">
        <span className="h-3 w-3 rounded-full bg-muted-foreground/30 border border-muted-foreground/20" />
        <span className="h-3 w-3 rounded-full bg-muted-foreground/30 border border-muted-foreground/20" />
        <span className="h-3 w-3 rounded-full bg-muted-foreground/30 border border-muted-foreground/20" />
      </div>
    );
  }
  return null;
};

export const CodeSnippet: React.FC<CodeSnippetProps> = ({
  code,
  language = 'typescript',
  inline = false,
  className,
  background = 'theme',
  windowVariant = 'none',
  title,
}) => {
  const { resolvedTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : true;
  const normalizedCode = useMemo(() => code.replace(/\n$/, ''), [code]);
  const showWindow = windowVariant !== 'none';

  // Use application background var(--background) or fallback to theme defaults
  const surfaceBg = background === 'background'
    ? 'var(--background)'
    : (isDark ? THEME_BG.dark : THEME_BG.light);

  const handleCopy = () => {
    navigator.clipboard.writeText(normalizedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return (
      <code
        className={cn(
          'bg-primary/10 px-1.5 py-0.5 rounded-md font-mono text-[0.85em] text-primary/90 border border-primary/10',
          'tracking-normal [font-variant-ligatures:none] font-features-["liga"_0,"calt"_0]',
          className,
        )}
        style={{ fontFamily: 'var(--font-mono-fixed), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
      >
        {normalizedCode}
      </code>
    );
  }

  return (
    <div
      className={cn(
        'relative group rounded-xl border border-border/50 overflow-hidden flex flex-col shadow-sm transition-all duration-300',
        typeof surfaceBg === 'string' && surfaceBg.includes('var') && 'bg-background', // Explicitly use tailwind utility if matching var(--background)
        className,
      )}
      style={{
        background: background === 'theme' ? surfaceBg : undefined,
      }}
    >
      {showWindow && (
        <div className="flex items-center border-b border-border/30 bg-muted/20 px-4 py-3 relative isolate">
          {/* Controls - Conditional alignment */}
          {windowVariant === 'windows' ? (
            <div className="absolute right-4 z-10 flex items-center h-full">
              <WindowControls variant={windowVariant} />
            </div>
          ) : (
            <div className="absolute left-4 z-10 flex items-center h-full">
              <WindowControls variant={windowVariant} />
            </div>
          )}

          {/* Title - Centered absolutely */}
          <div className="flex-1 text-center font-mono text-[13px] font-medium text-muted-foreground/70 truncate px-24">
            {title || ''}
          </div>

          {/* Copy - Position opposite to controls */}
          <div className={cn("absolute z-10 flex items-center h-full", windowVariant === 'windows' ? 'left-3' : 'right-3')}>
            <button
              onClick={handleCopy}
              aria-label="Copy code"
              className={cn(
                'p-1.5 rounded-md transition-all duration-200 backdrop-blur-sm',
                copied
                  ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                  : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:scale-105',
              )}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      )}

      {/* When no window is shown we just absolutely position the copy button */}
      {!showWindow && (
        <button
          onClick={handleCopy}
          aria-label="Copy code"
          className={cn(
            'absolute top-3 right-3 z-10 p-2 rounded-lg transition-all duration-200',
            'opacity-0 group-hover:opacity-100',
            copied
              ? 'bg-green-500/20 text-green-500 border border-green-500/30'
              : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:scale-105',
          )}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      )}

      {/* Wrapper to enforce consistent monospacing in both themes */}
      <div className="w-full overflow-x-auto custom-scrollbar [&_pre]:m-0! [&_code]:font-mono! [&_pre]:font-mono!">
        <SyntaxHighlighter
          style={isDark ? vscDarkPlus : oneLight}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: showWindow ? '1.25rem 1.5rem' : '1.5rem',
            background: 'transparent',
            // Enforce typography explicitly
            fontFamily: 'var(--font-mono-fixed), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: '0.875rem',
            lineHeight: '1.6',
            letterSpacing: 'normal',
            fontVariantLigatures: 'none',
            fontFeatureSettings: '"liga" 0, "calt" 0',
          }}
          codeTagProps={{
            style: {
              // Vital: prevent inner span elements from using mismatched theme fonts
              fontFamily: 'inherit',
              fontSize: 'inherit',
              lineHeight: 'inherit',
            }
          }}
        >
          {normalizedCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
