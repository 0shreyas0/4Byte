import React from 'react';
import Link from 'next/link';
import { Logo } from '../../../components/Logo';

interface FooterBrandProps {
  brand?: React.ReactNode;
  brandName?: string | React.ReactNode;
  brandDescription?: string | React.ReactNode;
  brandLogo?: React.ReactNode;
}

export const FooterBrand: React.FC<FooterBrandProps> = ({
  brand,
  brandName,
  brandDescription,
  brandLogo
}) => {
  if (brand) return <div className="col-span-1 md:col-span-2 lg:col-span-1">{brand}</div>;

  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-1">
      <div className="space-y-4">
        {(brandLogo || brandName) ? (
          <Link href="/" className="flex items-center gap-2 font-heading text-h3 text-primary">
            {brandLogo}
            {brandName && <span>{brandName}</span>}
          </Link>
        ) : (
          <Logo colorize />
        )}
        {brandDescription && (
          <div className="text-muted-foreground text-sm leading-body max-w-xs">
            {brandDescription}
          </div>
        )}
      </div>
    </div>
  );
};
