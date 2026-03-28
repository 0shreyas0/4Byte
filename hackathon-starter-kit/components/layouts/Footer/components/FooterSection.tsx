import React from 'react';
import Link from 'next/link';
import { FooterSection as FooterSectionType } from '../hooks/useFooter';

interface FooterSectionProps {
  section: FooterSectionType;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ section }) => {
  return (
    <div key={section.title}>
      <h3 className="font-heading text-foreground mb-4">{section.title}</h3>
      <ul className="space-y-3 text-sm">
        {section.links.map((link) => (
          <li key={link.label}>
            <Link 
              href={link.href} 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
