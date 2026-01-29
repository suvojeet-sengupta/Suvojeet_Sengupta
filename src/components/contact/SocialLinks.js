"use client";

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Social media links with animated icons - includes GitHub
 */
const SocialLinks = ({ className = "", size = "default" }) => {
  const iconSize = size === "small" ? "w-5 h-5" : "w-6 h-6";

  const socialLinksVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const socialIconVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const links = [
    {
      name: 'GitHub',
      href: 'https://github.com/suvojeet-sengupta',
      icon: (
        <svg className={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/@suvojeetsengupta',
      icon: (
        <svg className={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.502-9.407-.502-9.407-.502s-7.537 0-9.407.502A3.007 3.007 0 00.505 6.205C0 8.075 0 12 0 12s0 3.925.505 5.795a3.007 3.007 0 002.088 2.088c1.87.502 9.407.502 9.407.502s7.537 0 9.407-.502a3.007 3.007 0 002.088-2.088C24 15.925 24 12 24 12s0-3.925-.505-5.795z" fill="#FF0000" />
          <path d="M9.75 15.3V8.7l6.5 3.3-6.5 3.3z" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/suvojeet__sengupta',
      icon: (
        <svg className={iconSize} viewBox="0 0 24 24" fill="none">
          <defs>
            <radialGradient id="insta-gradient" cx="0.3" cy="1" r="1">
              <stop offset="0" stopColor="#FFD600" />
              <stop offset="0.5" stopColor="#FF7A00" />
              <stop offset="1" stopColor="#D62976" />
            </radialGradient>
          </defs>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.116 0-3.478.012-4.696.068-2.453.113-3.638 1.32-3.752 3.752-.056 1.218-.067 1.578-.067 4.696s.011 3.478.067 4.696c.114 2.432 1.299 3.638 3.752 3.752 1.218.056 1.578.067 4.696.067s3.478-.011 4.696-.067c2.453-.114 3.638-1.299 3.752-3.752.056-1.218.067-1.578.067-4.696s-.011-3.478-.067-4.696c-.114-2.432-1.299-3.638-3.752-3.752C15.478 3.977 15.116 3.965 12 3.965zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm6.405-8.573a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" fill="url(#insta-gradient)" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/suvojeetsengupta21',
      icon: (
        <svg className={iconSize} viewBox="0 0 24 24" fill="#1877F2">
          <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z" />
        </svg>
      ),
    },
    {
      name: 'Email',
      href: 'mailto:suvojeetsengupta@zohomail.in',
      icon: (
        <svg className={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <motion.div
      className={`flex items-center gap-4 ${className}`}
      variants={socialLinksVariants}
      initial="hidden"
      animate="visible"
    >
      {links.map((link) => (
        <motion.a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300"
          variants={socialIconVariants}
          whileHover={{ scale: 1.15, y: -2 }}
          whileTap={{ scale: 0.95 }}
          aria-label={link.name}
        >
          {link.icon}
        </motion.a>
      ))}
    </motion.div>
  );
};

export default SocialLinks;