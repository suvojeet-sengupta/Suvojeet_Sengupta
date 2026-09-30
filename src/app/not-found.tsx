import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found',
  description: "The page you're looking for doesn't exist.",
};

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/music', label: 'Music' },
  { href: '/blog', label: 'Writing' },
  { href: '/contact', label: 'Contact' },
];

export default function NotFound() {
  return (
    <div className="page min-h-[80vh] flex flex-col justify-center">
      <p className="page-eyebrow">404</p>
      <h1 className="page-title">This page doesn&apos;t exist.</h1>
      <p className="page-lede">
        The link may be old, or the address may have a typo. Try one of these instead:
      </p>
      <nav className="mt-10">
        <ul className="flex flex-wrap gap-x-7 gap-y-3 text-[16px]">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-link">{l.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
