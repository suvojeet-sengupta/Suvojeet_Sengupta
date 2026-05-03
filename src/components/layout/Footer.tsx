import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-[color:var(--line)]"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10 sm:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-10">
          <div>
            <Link
              href="/"
              className="flex items-baseline gap-1.5 text-[22px] font-black tracking-tight text-[color:var(--text-primary)]"
              style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' }}
            >
              SUVOJEET
              <span className="brand-dot" aria-hidden="true" />
            </Link>
            <p
              className="mt-4 max-w-sm text-[13px] leading-relaxed text-[color:var(--text-secondary)] opacity-75"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Built with precision and passion. High-performance software and soulful melodies.
              I am the <span className="text-[color:var(--neon)] italic font-bold">Vibe Coder</span>.
            </p>
          </div>

          <div className="flex gap-8 sm:gap-12 text-[11px] uppercase tracking-[0.2em]">
            <div className="flex flex-col gap-3">
              <span className="text-[color:var(--text-muted)] opacity-60">Navigation</span>
              <Link href="/" className="text-[color:var(--text-secondary)] hover:text-[color:var(--neon)]">Home</Link>
              <Link href="/about" className="text-[color:var(--text-secondary)] hover:text-[color:var(--neon)]">About</Link>
              <Link href="/music" className="text-[color:var(--text-secondary)] hover:text-[color:var(--neon)]">Music</Link>
              <Link href="/blog" className="text-[color:var(--text-secondary)] hover:text-[color:var(--neon)]">Blog</Link>
              <Link href="/dashboard/login" className="text-[color:var(--text-secondary)] hover:text-[color:var(--neon)]">Dashboard</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[color:var(--text-muted)] opacity-60">Social</span>
              <Link href="https://github.com/suvojeet-sengupta" target="_blank" className="text-[color:var(--text-secondary)] hover:text-[color:var(--neon)]">Github</Link>
              <Link href="https://linkedin.com/in/suvojeet-sengupta" target="_blank" className="text-[color:var(--text-secondary)] hover:text-[color:var(--neon)]">LinkedIn</Link>
              <Link href="https://instagram.com/suvojeet_sengupta" target="_blank" className="text-[color:var(--text-secondary)] hover:text-[color:var(--neon)]">Instagram</Link>
              <Link href="https://youtube.com/@suvojeetsengupta" target="_blank" className="text-[color:var(--text-secondary)] hover:text-[color:var(--neon)]">YouTube</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-[color:var(--line)] flex flex-col md:flex-row justify-between items-center md:items-center gap-3 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[color:var(--text-secondary)] opacity-60 text-center md:text-left">
          <p>© {currentYear} Suvojeet Sengupta · Born Asansol · Pressed in Dhanbad</p>
          <p>Designed &amp; engineered by Suvojeet</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
