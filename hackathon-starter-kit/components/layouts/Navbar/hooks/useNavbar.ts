'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export interface NavLink {
  href: string;
  label: string;
}

export interface NavbarUser {
  name: string;
  email?: string;
  avatar?: string;
}

export const useNavbar = (onSearch?: (query: string) => void, initialPathname?: string) => {
  const currentPathname = usePathname();
  const pathname = initialPathname ?? currentPathname;
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(search);
  }, [onSearch, search]);

  const toggleProfile = useCallback(() => {
    setIsProfileOpen(prev => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return {
    pathname,
    mounted,
    search,
    setSearch,
    isProfileOpen,
    setIsProfileOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    handleSearch,
    toggleProfile,
    toggleMobileMenu,
    closeMobileMenu
  };
};
