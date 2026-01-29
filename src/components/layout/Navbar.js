"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * A responsive navigation bar component.
 * Features:
 * - A sticky header that changes background on scroll.
 * - A mobile menu that slides down.
 * - Framer Motion animations for a smooth user experience.
 * - Active link styling.
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Effect to handle the navbar background change on scroll.
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Effect to prevent scrolling when the mobile menu is open.
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMenuOpen]);

  const activeLinkStyle = {
    color: '#f9a828',
    fontWeight: '600',
  };

  // Animation variants for Framer Motion.
  const navVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const mobileMenuVariants = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  /**
   * A wrapper around Link to add motion effects.
   */
  const NavLinkMotion = ({ href, children, style, onClick }) => (
    <motion.div whileHover={{ scale: 1.1, color: '#f9a828' }} transition={{ duration: 0.2 }}>
      <Link href={href} className="text-gray-300 transition-colors duration-300" style={style} onClick={onClick}>
        {children}
      </Link>
    </motion.div>
  );

  const isActive = (path) => pathname === path;

  return (
    <motion.nav
      variants={navVariants}
      initial="initial"
      animate="animate"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${(isScrolled || isMenuOpen) ? 'bg-dark/70 backdrop-blur-lg shadow-lg' : 'bg-transparent'
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="text-2xl font-bold font-montserrat text-white">
              Suvojeet
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLinkMotion href="/" style={isActive('/') ? activeLinkStyle : undefined}>Home</NavLinkMotion>
            <NavLinkMotion href="/about" style={isActive('/about') ? activeLinkStyle : undefined}>About</NavLinkMotion>
            <NavLinkMotion href="/music" style={isActive('/music') ? activeLinkStyle : undefined}>Music</NavLinkMotion>
            <NavLinkMotion href="/blog" style={isActive('/blog') ? activeLinkStyle : undefined}>Blog</NavLinkMotion>
            <NavLinkMotion href="/posts" style={isActive('/posts') ? activeLinkStyle : undefined}>Posts</NavLinkMotion>
          </div>

          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <div className="md:hidden ml-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-300 hover:text-primary focus:outline-none"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden"
            variants={mobileMenuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-primary hover:bg-gray-700" style={isActive('/') ? activeLinkStyle : undefined} onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-primary hover:bg-gray-700" style={isActive('/about') ? activeLinkStyle : undefined} onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link href="/music" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-primary hover:bg-gray-700" style={isActive('/music') ? activeLinkStyle : undefined} onClick={() => setIsMenuOpen(false)}>Music</Link>
              <Link href="/blog" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-primary hover:bg-gray-700" style={isActive('/blog') ? activeLinkStyle : undefined} onClick={() => setIsMenuOpen(false)}>Blog</Link>
              <Link href="/posts" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-primary hover:bg-gray-700" style={isActive('/posts') ? activeLinkStyle : undefined} onClick={() => setIsMenuOpen(false)}>Posts</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;