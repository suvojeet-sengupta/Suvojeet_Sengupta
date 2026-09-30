'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '@/components/common/ThemeToggle';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { name: 'Work', path: '/#work' },
  { name: 'About', path: '/about' },
  { name: 'Music', path: '/music' },
  { name: 'Writing', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMobileMenuOpen(false), [pathname]);

  const isActive = (path: string) =>
    path.startsWith('/#') ? false : path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color] duration-300 border-b',
        isScrolled || mobileMenuOpen
          ? 'bg-[color:var(--bg-primary)]/90 backdrop-blur-md border-[color:var(--line)]'
          : 'bg-transparent border-transparent'
      )}
    >
      <nav className="max-w-[1240px] mx-auto flex items-center justify-between h-16 px-5 sm:px-10">
        <Link
          href="/"
          className="text-[19px] tracking-[-0.01em] text-[color:var(--text-primary)]"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Suvojeet Sengupta
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-7 list-none text-[14px]">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                  className={cn(
                    'transition-colors py-1 border-b',
                    isActive(link.path)
                      ? 'text-[color:var(--text-primary)] border-[color:var(--text-primary)]'
                      : 'text-[color:var(--text-tertiary)] border-transparent hover:text-[color:var(--text-primary)]'
                  )}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="p-2 -mr-2 text-[color:var(--text-primary)]"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
              {mobileMenuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[color:var(--line)] px-5 pb-6 pt-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'block py-3 text-[22px] border-b border-[color:var(--line)]',
                isActive(link.path) ? 'text-[color:var(--text-primary)]' : 'text-[color:var(--text-secondary)]'
              )}
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
