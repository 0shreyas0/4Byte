'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '../../utils/cn';

interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'small' | 'med' | 'big';
  showText?: boolean;
  href?: string;
  logoPath?: string;
  /**
   * When true, the logo image (which must be a black shape on a transparent
   * background) will be dynamically tinted to the current --primary CSS
   * variable color. Reacts to theme changes in real-time.
   */
  colorize?: boolean;
}

const VARIANT_SIZES = {
  small: 36,
  med: 60,
  big: 84,
};

export const Logo: React.FC<LogoProps> = ({
  className,
  size,
  variant = 'med',
  showText = false,
  href = '/',
  logoPath,
  colorize = false,
}) => {
  const effectiveSize = size || VARIANT_SIZES[variant];
  const maskStyle = (src: string): React.CSSProperties => ({
    width: effectiveSize,
    height: effectiveSize,
    backgroundColor: 'var(--primary)',
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
  });

  const renderImage = (src: string, alt: string, extraClassName?: string) => (
    <Image
      src={src}
      alt={alt}
      width={effectiveSize}
      height={effectiveSize}
      className={cn(
        'h-full w-auto object-contain transition-all duration-300',
        extraClassName,
      )}
      priority
    />
  );

  const renderColorized = (src: string, alt: string) => (
    <span
      role="img"
      aria-label={alt}
      className="block transition-all duration-300"
      style={maskStyle(src)}
    />
  );

  return (
    <Link
      href={href}
      className={cn('flex items-center gap-2 group select-none outline-none', className)}
    >
      <div
        className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{ height: effectiveSize }}
      >
        {/* Custom logoPath: just render it with optional colorize */}
        {logoPath ? (
          colorize ? renderColorized(logoPath, 'Logo') : renderImage(logoPath, 'Logo')
        ) : colorize ? (
          /* Single image tinted to primary — uses CSS mask with --primary */
          renderColorized('/logo.png', 'Logo')
        ) : (
          renderImage('/logo.png', 'Logo')
        )}
      </div>

      {showText && (
        <span className="font-heading text-xl tracking-tighter text-foreground whitespace-nowrap">
          HACKATHON<span className="text-primary">KIT</span>
        </span>
      )}
    </Link>
  );
};
