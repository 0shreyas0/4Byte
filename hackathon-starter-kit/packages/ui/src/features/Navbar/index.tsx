'use client';

import React from 'react';
import { Menu, X } from 'lucide-react';
import { useNavbar, NavLink, NavbarUser } from './hooks/useNavbar';
import { NavLogo } from './components/NavLogo';
import { NavLinks } from './components/NavLinks';
import { MobileMenu } from './components/MobileMenu';
import { ThemeToggler } from '../../components/ThemeToggler';
import { SearchBar } from '../SearchBar';
import { UserProfile } from '../../components/UserProfile';

interface NavbarProps {
  logo?: React.ReactNode;
  brandName?: string | React.ReactNode;
  brandLogo?: React.ReactNode;
  links?: NavLink[];
  user?: NavbarUser | null;
  onSearch?: (query: string) => void;
  onLogout?: () => void;
  onSwitchAccount?: () => void;
  actions?: React.ReactNode;
  className?: string;
  showThemeToggle?: boolean;
  pathname?: string;
  logoHref?: string;
  layoutId?: string;
  onLinkClick?: (href: string) => void;
  surfaceScheme?: 'secondary' | 'background';
}

export function Navbar({
  logo,
  brandName = "",
  brandLogo,
  links = [],
  user = null,
  onSearch,
  onLogout,
  actions,
  className = "",
  showThemeToggle = true,
  pathname: customPathname,
  logoHref = "/",
  layoutId,
  onLinkClick,
  onSwitchAccount,
  surfaceScheme = 'background',
}: NavbarProps) {
  const {
    pathname,
    isProfileOpen,
    setIsProfileOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    closeMobileMenu
  } = useNavbar(onSearch, customPathname);

  const navbarBgClass = surfaceScheme === 'secondary' ? 'bg-secondary' : 'bg-background';

  return (
    <nav className={`border-b border-border ${navbarBgClass} sticky top-0 z-50 ${className}`}>
      <div className="w-full flex h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left — Logo only */}
        <NavLogo logo={logo} brandLogo={brandLogo} brandName={brandName} href={logoHref} />

        {/* Right — Search + NavLinks + ThemeToggler + UserProfile */}
        <div className="hidden md:flex items-center gap-3">
          {onSearch && (
            <SearchBar
              placeholder="Search components..."
              onItemSelect={(item) => {
                if (onSearch) onSearch(item.title);
              }}
            />
          )}

          <NavLinks
            links={links}
            pathname={pathname}
            layoutId={layoutId}
            onLinkClick={onLinkClick}
            surfaceScheme={surfaceScheme}
          />

          {showThemeToggle && <ThemeToggler />}

          {user ? (
            <UserProfile
              user={user}
              isProfileOpen={isProfileOpen}
              setIsProfileOpen={setIsProfileOpen}
              onLogout={onLogout}
              onSwitchAccount={onSwitchAccount}
            />
          ) : (
            <div className="flex items-center gap-2">{actions}</div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 md:hidden rounded-md hover:bg-accent transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <MobileMenu 
          links={links} 
          pathname={pathname} 
          onClose={closeMobileMenu} 
          showThemeToggle={showThemeToggle}
        />
      )}
    </nav>
  );
}

export * from './hooks/useNavbar';
