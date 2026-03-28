import React from 'react';
import Link from 'next/link';
import { Logo } from '../../../components/Logo';

interface NavLogoProps {
  logo?: React.ReactNode;
  brandLogo?: React.ReactNode;
  brandName?: string | React.ReactNode;
  href?: string;
}

export const NavLogo: React.FC<NavLogoProps> = ({ logo, brandLogo, brandName, href = "/" }) => {
  if (logo) return <Link href={href} className="mr-8">{logo}</Link>;

  if (brandLogo || brandName) {
    return (
      <Link href={href} className="mr-8">
        <div className="flex items-center gap-2 font-heading text-h3 tracking-heading text-primary whitespace-nowrap">
          {brandLogo}
          <span>{brandName}</span>
        </div>
      </Link>
    );
  }

  return <Logo href={href} size={84} className="mr-8" colorize />;
};

