import React from 'react';
import Link from 'next/link';
import { calculateAge } from '@/lib/utils';
import HeroContent from './HeroContent';
import VinylSection from './VinylSection';
import styles from './HomePage.module.css';

interface HomePageProps {
  children?: React.ReactNode;
}

const HomePage = ({ children }: HomePageProps) => {
  const age = calculateAge('2005-08-01');

  return (
    <div className="min-h-screen">
      {/* ========= HERO ========= */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true" />
        <HeroContent age={age} />
        <VinylSection />
      </section>

      {/* ========= TRACKS (FeaturedProjects rendered as tracklist) ========= */}
      <section id="tracks" className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <div className={styles.sectionNum}>02 / Tracklist</div>
            <h2 className={styles.sectionTitle}>
              Selected <em>Works</em>
            </h2>
          </div>
          <div className={styles.sectionMeta}>
            Last updated · {new Date().toISOString().slice(0, 7).replace('-', '.')}
            <br />
            Side A — Code · Side B — Voice
          </div>
        </div>

        {children}
      </section>

      {/* ========= APPROACH ========= */}
      <section className={styles.approach} id="approach">
        <div className={styles.approachInner}>
          <div className={styles.sectionHead}>
            <div>
              <div className={styles.sectionNum}>03 / Method</div>
              <h2 className={styles.sectionTitle}>
                Three <em>Beats</em>
              </h2>
            </div>
            <div className={styles.sectionMeta}>How the<br />record gets cut</div>
          </div>

          <div className={styles.approachGrid}>
            <div className={styles.approachCard}>
              <div className={styles.approachCardNum}>01</div>
              <h3>Technical Excellence</h3>
              <p>
                Clean architecture, native patterns, real benchmarks. SuvMusic and
                NoteNext aren&apos;t side projects — they&apos;re release-grade software
                meant to be lived in.
              </p>
            </div>
            <div className={styles.approachCard}>
              <div className={styles.approachCardNum}>02</div>
              <h3>Creative Phrasing</h3>
              <p>
                A song is timing and a UI is timing. Every animation, every hover,
                every transition is composed the same way I&apos;d phrase a vocal —
                with feel.
              </p>
            </div>
            <div className={styles.approachCard}>
              <div className={styles.approachCardNum}>03</div>
              <h3>Constant Practice</h3>
              <p>
                Logic over memorisation. Voice over volume. Every project, every
                cover, every commit is a rehearsal for the next one being better.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========= QUOTE ========= */}
      <section className={styles.quote}>
        <blockquote>
          &ldquo;I build things <em>I want to use</em>. If it isn&apos;t fast,
          clean, and intuitive — it isn&apos;t finished.&rdquo;
        </blockquote>
        <div className={styles.quoteAuthor}>— Suvojeet Sengupta · Born Asansol · Living Dhanbad</div>
      </section>

      {/* ========= CTA ========= */}
      <section className={styles.cta} id="contact">
        <div className={styles.ctaInner}>
          <div className={styles.ctaTag}>Side B · Booking Open</div>
          <h2 className={styles.ctaTitle}>
            Let&apos;s cut <em>something</em> real.
          </h2>
          <p className={styles.ctaSub}>
            Need an Android engineer who phrases code like a melody — or a voice
            for your next session? Studio is open.
          </p>
          <Link href="/contact" className={styles.btnCta}>
            Open the Booth
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
