import React, { useRef, useLayoutEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from '../hooks/useNavbar';

interface NavLinksProps {
  links: NavLink[];
  pathname: string;
  layoutId?: string;
  onLinkClick?: (href: string) => void;
}

export const NavLinks: React.FC<NavLinksProps> = ({ links, pathname, layoutId = "nav-pill", onLinkClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null);
  const prevPathnameRef = useRef(pathname);
  const isRouteChange = prevPathnameRef.current !== pathname;

  useLayoutEffect(() => {
    const activeLink = links.find(link =>
      pathname === link.href ||
      (link.href !== '/' && pathname.startsWith(`${link.href}/`))
    );

    if (!activeLink || !containerRef.current) {
      setPillStyle(null);
      return;
    }

    const linkEl = linkRefs.current[activeLink.href];
    const containerEl = containerRef.current;

    if (!linkEl) {
      setPillStyle(null);
      return;
    }

    const containerRect = containerEl.getBoundingClientRect();
    const linkRect = linkEl.getBoundingClientRect();

    setPillStyle({
      left: linkRect.left - containerRect.left,
      width: linkRect.width,
    });

    prevPathnameRef.current = pathname;
  }, [pathname, links]);

  return (
    <div
      ref={containerRef}
      className="hidden md:flex items-center bg-secondary rounded-full p-1 mr-4 relative"
    >
      {/* The pill — positioned absolutely within the container, never uses scroll-affected coordinates */}
      <AnimatePresence initial={false}>
        {pillStyle && (
          <motion.span
            key={layoutId}
            className="absolute top-1 bottom-1 bg-background rounded-full shadow-sm pointer-events-none z-0"
            initial={isRouteChange
              ? { opacity: 0, left: pillStyle.left, width: pillStyle.width }
              : { opacity: 0 }
            }
            animate={{ opacity: 1, left: pillStyle.left, width: pillStyle.width }}
            transition={isRouteChange
              ? { duration: 0 }
              : { type: 'spring', stiffness: 350, damping: 30 }
            }
          />
        )}
      </AnimatePresence>

      {links.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== '/' && pathname.startsWith(`${link.href}/`));
        return (
          <Link
            key={`${link.href}-${link.label}`}
            href={link.href}
            ref={(el) => { linkRefs.current[link.href] = el; }}
            onClick={(e) => {
              if (onLinkClick) {
                e.preventDefault();
                onLinkClick(link.href);
              }
            }}
            className={`relative px-4 py-1.5 rounded-full text-sm font-action transition-colors z-10 ${
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
};
