'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import styles from './HomePage.module.css';

interface Stat {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
}

const STATS: Stat[] = [
  { value: 201, suffix: '+', label: 'GitHub Stars', sublabel: 'across all projects' },
  { value: 4,   suffix: '',  label: 'Projects Shipped', sublabel: 'release-grade software' },
  { value: 20,  suffix: '+', label: 'Songs Recorded', sublabel: 'Hindi & Bengali' },
  { value: 3,   suffix: '+', label: 'Years Building', sublabel: 'AI-driven development' },
];

function Counter({ value, suffix, duration = 1.2 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(value);
    };
    requestAnimationFrame(step);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [stats, setStats] = useState<Stat[]>(STATS);

  useEffect(() => {
    async function getDynamicStats() {
      try {
        const response = await fetch('https://suvojeet-api.suvojeetsengupta.in/api/github-stats');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const data = result.data;
            
            // Calculate total stars across all repositories
            let totalStars = 0;
            Object.values(data).forEach((repo: any) => {
              totalStars += repo.stargazers_count || 0;
            });
            
            // Calculate projects shipped (baseline of 4, or repository count if higher)
            const projectsCount = Math.max(4, Object.keys(data).length);
            
            // Calculate years building dynamically starting from 2023
            const yearsBuilding = Math.max(3, new Date().getFullYear() - 2023);

            setStats([
              { value: totalStars || 201, suffix: '+', label: 'GitHub Stars', sublabel: 'across all projects' },
              { value: projectsCount,     suffix: '',  label: 'Projects Shipped', sublabel: 'release-grade software' },
              { value: 20,                suffix: '+', label: 'Songs Recorded', sublabel: 'Hindi & Bengali' },
              { value: yearsBuilding,     suffix: '+', label: 'Years Building', sublabel: 'AI-driven development' },
            ]);
          }
        }
      } catch (error) {
        console.error('Failed to load dynamic stats from VPS:', error);
      }
    }
    getDynamicStats();
  }, []);

  return (
    <section className={styles.statsSection} ref={ref}>
      <div className={styles.statsInner}>
        <motion.div
          className={styles.statsGrid}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={itemVariants} className={styles.statCard}>
              <div className={styles.statCardNum}>
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className={styles.statCardLabel}>{stat.label}</div>
              <div className={styles.statCardSub}>{stat.sublabel}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
