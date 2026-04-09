import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-tertiary py-12 border-t border-light">
      <div className="section-container !py-0">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <Link href="/" className="text-2xl font-black tracking-tighter hover:text-accent transition-colors">
              SUVOJEET<span className="text-accent">.</span>
            </Link>
            <p className="mt-4 text-secondary max-w-sm">
              Built with precision and passion. High-performance software and soulful melodies.
            </p>
          </div>

          <div className="flex gap-12 text-sm font-bold uppercase tracking-widest">
            <div className="flex flex-col gap-3">
              <span className="text-muted text-xs">Navigation</span>
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
              <Link href="/about" className="hover:text-accent transition-colors">About</Link>
              <Link href="/music" className="hover:text-accent transition-colors">Music</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-muted text-xs">Social</span>
              <Link href="https://github.com/suvojeet-sengupta" target="_blank" className="hover:text-accent transition-colors">Github</Link>
              <Link href="https://linkedin.com/in/suvojeet-sengupta" target="_blank" className="hover:text-accent transition-colors">LinkedIn</Link>
              <Link href="https://instagram.com/suvojeet_sengupta" target="_blank" className="hover:text-accent transition-colors">Instagram</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-light flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted font-medium uppercase tracking-widest">
          <p>© {currentYear} SUVOJEET SENGUPTA. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <span>DESIGNED BY SUVOJEET</span>
            <span>POWERED BY NEXT.JS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
