import React from 'react';
import Link from 'next/link';
import { FooterLink } from '../hooks/useFooter';

interface FooterBottomProps {
  copyright: string;
  links: FooterLink[];
}

export const FooterBottom: React.FC<FooterBottomProps> = ({ copyright, links }) => {
  return (
    <div className="border-t border-border pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4">
      {copyright && (
        <p className="text-sm text-muted-foreground order-2 md:order-1">
          {copyright}
        </p>
      )}
      
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 order-1 md:order-2">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
