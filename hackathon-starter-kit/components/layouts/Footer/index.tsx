'use client';

import React from 'react';
import { useFooter, FooterSection as FooterSectionType, FooterLink } from './hooks/useFooter';
import { FooterBrand } from './components/FooterBrand';
import { FooterSection } from './components/FooterSection';
import { FooterBottom } from './components/FooterBottom';

interface FooterProps {
  brand?: React.ReactNode;
  brandName?: string | React.ReactNode;
  brandDescription?: string | React.ReactNode;
  brandLogo?: React.ReactNode;
  sections?: FooterSectionType[];
  copyright?: string;
  className?: string;
  bottomLinks?: FooterLink[];
}

export default function Footer({
  brand,
  brandName = "",
  brandDescription = "",
  brandLogo,
  sections = [],
  copyright,
  className = "",
  bottomLinks = []
}: FooterProps) {
  const { effectiveCopyright } = useFooter(copyright, brandName);

  return (
    <footer className={`bg-background border-t border-border ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          
          <FooterBrand 
            brand={brand}
            brandName={brandName}
            brandDescription={brandDescription}
            brandLogo={brandLogo}
          />

          {sections.map((section) => (
            <FooterSection key={section.title} section={section} />
          ))}
        </div>

        <FooterBottom 
          copyright={effectiveCopyright}
          links={bottomLinks}
        />
      </div>
    </footer>
  );
}
