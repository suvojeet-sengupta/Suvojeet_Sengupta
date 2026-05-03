'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/components/common/ThemeToggle';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Music', path: '/music' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        'flex justify-between items-center px-8 py-[18px]',
        isScrolled
          ? 'bg-[color:var(--ink)]/85 backdrop-blur-md border-b border-[color:var(--line)]'
          : 'bg-gradient-to-b from-[color:var(--bg-primary)]/85 to-transparent backdrop-blur-sm'
      )}
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      {/* Brand */}
      <Link
        href="/"
        className="flex items-baseline gap-1.5 text-[22px] font-black tracking-tight serif text-[color:var(--text-primary)] hover:opacity-90"
        style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' }}
      >
        SUVOJEET
        <span className="brand-dot" aria-hidden="true" />
      </Link>

      {/* Desktop nav */}
      <ul className="hidden md:flex items-center gap-7 list-none text-[11px] uppercase tracking-[0.15em]">
        {navLinks.map((link) => {
          const active = pathname === link.path;
          return (
            <li key={link.path}>
              <Link
                href={link.path}
                className={cn(
                  'transition-opacity transition-colors hover:opacity-100 hover:text-[color:var(--neon)]',
                  active
                    ? 'text-[color:var(--neon)] opacity-100 before:content-["◆_"]'
                    : 'text-[color:var(--text-secondary)] opacity-70'
                )}
              >
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Now playing + theme toggle */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.15em] text-[color:var(--text-secondary)] opacity-65">
          <div className="equalizer" aria-hidden="true">
            <span /><span /><span /><span />
          </div>
          <span>Live Set · {new Date().getFullYear()}</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Mobile toggle */}
      <div className="flex items-center gap-3 md:hidden">
        <ThemeToggle />
        <button
          aria-label="Toggle menu"
          className="p-2 text-[color:var(--text-primary)]"
          onClick={() => setMobileMenuOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu — React state, no vanilla DOM */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-[color:var(--bg-secondary)] border-b border-[color:var(--line-strong)] flex flex-col gap-5 p-6 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'text-sm uppercase tracking-[0.2em]',
                  pathname === link.path ? 'text-[color:var(--neon)]' : 'text-[color:var(--text-primary)]'
                )}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
