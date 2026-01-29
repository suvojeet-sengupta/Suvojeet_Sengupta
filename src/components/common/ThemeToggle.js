"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';

/**
 * Animated theme toggle button with sun/moon icons
 */
const ThemeToggle = ({ className = '' }) => {
    const { theme, toggleTheme } = useTheme();

    const iconVariants = {
        initial: { scale: 0, rotate: -180, opacity: 0 },
        animate: { scale: 1, rotate: 0, opacity: 1, transition: { duration: 0.3 } },
        exit: { scale: 0, rotate: 180, opacity: 0, transition: { duration: 0.3 } }
    };

    return (
        <motion.button
            onClick={toggleTheme}
            className={`relative p-2 rounded-xl bg-transparent hover:bg-[var(--bg-tertiary)] border border-transparent hover:border-[var(--border-light)] transition-all duration-300 ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                    <motion.svg
                        key="sun"
                        className="w-5 h-5 text-[var(--accent-creative)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        variants={iconVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                    </motion.svg>
                ) : (
                    <motion.svg
                        key="moon"
                        className="w-5 h-5 text-[var(--accent-primary)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        variants={iconVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                    </motion.svg>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

export default ThemeToggle;
