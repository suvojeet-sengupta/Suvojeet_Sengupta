import React from 'react';
import Link from 'next/link';

const SITE_LINKS = [
  { name: 'Work', href: '/#work' },
  { name: 'About', href: '/about' },
  { name: 'Music', href: '/music' },
  { name: 'Writing', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

const SOCIAL_LINKS = [
  { name: 'GitHub', href: 'https://github.com/suvojeet-sengupta' },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/suvojeet-sengupta' },
  { name: 'YouTube', href: 'https://youtube.com/@suvojeetsengupta' },
  { name: 'Instagram', href: 'https://instagram.com/suvojeet__sengupta' },
];

const linkClass =
  'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[color:var(--line)]">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-10 pt-14 pb-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="text-[22px] text-[color:var(--text-primary)]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Suvojeet Sengupta
            </Link>
            <p className="mt-3 max-w-sm text-[14px]">
              Software developer and vocalist based in Dhanbad, India.
            </p>
            <a
              href="mailto:suvojeet@suvojeetsengupta.in"
              className="mt-4 inline-block text-[14px] text-[color:var(--text-primary)] border-b border-[color:var(--line-strong)] hover:border-[color:var(--text-primary)] transition-colors"
            >
              suvojeet@suvojeetsengupta.in
            </a>
          </div>

          <div>
            <div className="text-[13px] text-[color:var(--text-muted)] mb-4">Site</div>
            <ul className="space-y-2.5 text-[14px]">
              {SITE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>{l.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[13px] text-[color:var(--text-muted)] mb-4">Elsewhere</div>
            <ul className="space-y-2.5 text-[14px]">
              {SOCIAL_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-[color:var(--line)] flex flex-col sm:flex-row justify-between gap-2 text-[13px] text-[color:var(--text-muted)]">
          <p className="text-[13px] text-[color:var(--text-muted)]">© {currentYear} Suvojeet Sengupta</p>
          <Link href="/dashboard/login" className="hover:text-[color:var(--text-secondary)] transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
