'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './HomePage.module.css';

interface HeroContentProps {
  age: number;
}

const HeroContent = ({ age }: HeroContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className={styles.heroTag}>Side A · Burnpur → Dhanbad → World</div>
      <h1 className={styles.heroTitle}>
        Singer<br />
        <span className={styles.strike}>just</span>{' '}
        <span className={styles.accent}>&amp; Vibe Architect</span>
      </h1>
      <p className={styles.heroSub}>
        Suvojeet Sengupta — a {age}-year-old vocalist trained in{' '}
        <strong>Hindi &amp; Bengali</strong> traditions, architecting{' '}
        <strong>high-performance logic &amp; vibes</strong> with the power of AI.
        Two crafts. One pulse.
      </p>

      <div className={styles.heroCta}>
        <Link href="#tracks" className={`${styles.btn} ${styles.btnPrimary}`}>
          Listen to the Set
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </Link>
        <Link href="/about" className={`${styles.btn} ${styles.btnGhost}`}>
          Read Liner Notes →
        </Link>
      </div>

      <div className={styles.heroStats}>
        <div>
          <div className={styles.statNum}>{age}</div>
          <div className={styles.statLabel}>Years on this Earth</div>
        </div>
        <div>
          <div className={styles.statNum}>02</div>
          <div className={styles.statLabel}>Languages Sung</div>
        </div>
        <div>
          <div className={styles.statNum}>15+</div>
          <div className={styles.statLabel}>Stars on GitHub</div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroContent;
