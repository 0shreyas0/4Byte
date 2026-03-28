import React from 'react';
import Link from 'next/link';
import { NavLink } from '../hooks/useNavbar';
import { ThemeToggler } from '../../../components/ThemeToggler';

interface MobileMenuProps {
  links: NavLink[];
  pathname: string;
  onClose: () => void;
  showThemeToggle?: boolean;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ links, pathname, onClose, showThemeToggle }) => {
  return (
    <div className="md:hidden border-t border-border bg-background p-4 space-y-4 shadow-lg absolute w-full left-0 top-16 z-40">
      <div className="flex flex-col gap-2 text-center">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== '/' && pathname.startsWith(`${link.href}/`));
          return (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              onClick={onClose}
              className={`px-4 py-3 rounded-lg text-sm font-action transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {showThemeToggle && (
        <div className="flex justify-center pt-2 border-t border-border">
          <ThemeToggler />
        </div>
      )}
    </div>
  );
};
