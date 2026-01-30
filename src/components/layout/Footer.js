"use client";

import React from 'react';
import Link from 'next/link';
import SocialLinks from '../contact/SocialLinks';
import Newsletter from '../contact/Newsletter';
import LiveIndicator from '../common/LiveIndicator';

import { navLinks } from '@/data/config';

const Footer = ({ visitorCount }) => {
  const currentYear = new Date().getFullYear();

  // Use only the first 4 links for the footer or all if preferred. 
  // Original had Home, About, Music, Blog. New Nav has Posts too. 
  // Let's include all nav links for consistency.
  const quickLinks = navLinks;

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-light)]">
      <Newsletter />

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <Link href="/" className="inline-block mb-4">
              <h3 className="text-2xl font-bold font-montserrat gradient-text">
                Suvojeet
              </h3>
            </Link>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Singer, Android Vibe Coder, and System Architect. Building production-grade mobile applications with architectural precision.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Quick Links
            </h4>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Connect
            </h4>
            <div className="flex justify-center md:justify-end">
              <SocialLinks size="small" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border-light)]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[var(--text-muted)] text-sm">
              © {currentYear} Suvojeet Sengupta. All Rights Reserved.
            </p>

            <div className="flex items-center gap-6">
              {visitorCount > 0 && (
                <LiveIndicator
                  count={visitorCount}
                  text={visitorCount === 1 ? 'visitor online' : 'visitors online'}
                />
              )}
              <p className="text-[var(--text-muted)] text-sm">
                Designed with{' '}
                <span className="text-red-500">♥</span>
                {' '}by{' '}
                <a
                  href="https://github.com/suvojeet-sengupta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-primary)] hover:underline"
                >
                  Suvojeet
                </a>
              </p>
            </div>
          </div>

          {/* Quote */}
          <div className="mt-6 text-center">
            <p className="text-[var(--text-muted)] text-sm italic">
              "Bolne wale sirf shor karte hain, dekhne wale khel samajh jate hain."
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
