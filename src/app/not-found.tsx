import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Not Found | Suvojeet Sengupta',
  description: "This groove doesn't exist on the record.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* Decorative label */}
      <div
        className="font-mono text-[11px] uppercase tracking-[0.3em] mb-8"
        style={{ color: 'var(--neon)' }}
      >
        Side X · Error 404
      </div>

      {/* Big number */}
      <p
        className="font-serif font-black leading-none tracking-tighter mb-6 select-none"
        style={{
          fontSize: 'clamp(120px, 25vw, 240px)',
          background: 'linear-gradient(135deg, var(--neon) 0%, var(--ember) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
        aria-hidden
      >
        404
      </p>

      {/* Heading */}
      <h1
        className="font-serif font-light leading-tight tracking-tight mb-4"
        style={{ fontSize: 'clamp(28px, 5vw, 56px)', color: 'var(--text-primary)' }}
      >
        Track <em className="font-black not-italic" style={{ color: 'var(--neon)' }}>Not Found</em>
      </h1>

      {/* Sub-copy */}
      <p
        className="font-mono text-sm uppercase tracking-[0.15em] mb-12 max-w-sm"
        style={{ color: 'var(--text-muted)' }}
      >
        This groove doesn&apos;t exist on the record.
        <br />
        The needle skipped, or the track was never pressed.
      </p>

      {/* Navigation links */}
      <nav className="flex flex-wrap gap-4 justify-center">
        {[
          { href: '/', label: 'Side A — Home' },
          { href: '/blog', label: 'Blog' },
          { href: '/music', label: 'Music' },
          { href: '/contact', label: 'Contact' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="font-mono text-[11px] uppercase tracking-[0.2em] px-5 py-3 border transition-all duration-200"
            style={{
              borderColor: 'var(--line-strong)',
              color: 'var(--text-secondary)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--neon)';
              (e.currentTarget as HTMLElement).style.color = 'var(--neon)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--line-strong)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
            }}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Decorative groove lines */}
      <div className="mt-20 flex flex-col gap-[6px] opacity-20 pointer-events-none" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              height: '1px',
              width: `${160 - i * 20}px`,
              background: 'var(--neon)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
