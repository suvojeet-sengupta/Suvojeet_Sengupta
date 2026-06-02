import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Not Found | Suvojeet Sengupta',
  description: "This groove doesn't exist on the record.",
};

export default function NotFound() {
  return (
    <>
      <style>{`
        .not-found-link {
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          padding: 12px 20px;
          border: 1px solid var(--line-strong);
          color: var(--text-secondary);
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
          display: inline-block;
        }
        .not-found-link:hover {
          border-color: var(--neon);
          color: var(--neon);
        }
        .not-found-num {
          font-family: var(--font-serif);
          font-weight: 900;
          font-size: clamp(120px, 25vw, 240px);
          line-height: 1;
          letter-spacing: -0.06em;
          background: linear-gradient(135deg, var(--neon) 0%, var(--ember) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          user-select: none;
        }
        .not-found-heading {
          font-family: var(--font-serif);
          font-weight: 300;
          font-size: clamp(28px, 5vw, 56px);
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }
        .not-found-heading em {
          font-weight: 900;
          font-style: italic;
          color: var(--neon);
        }
        .not-found-sub {
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--text-muted);
          line-height: 1.8;
          margin-bottom: 3rem;
        }
        .not-found-tag {
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--neon);
          margin-bottom: 2rem;
        }
        .not-found-groove {
          width: 160px;
          height: 1px;
          background: var(--neon);
          opacity: 0.2;
          border-radius: 999px;
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', textAlign: 'center' }}>
        <div className="not-found-tag">Side X · Error 404</div>

        <p className="not-found-num" aria-hidden>404</p>

        <h1 className="not-found-heading">
          Track <em>Not Found</em>
        </h1>

        <p className="not-found-sub">
          This groove doesn&apos;t exist on the record.<br />
          The needle skipped, or the track was never pressed.
        </p>

        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          <Link href="/" className="not-found-link">Side A — Home</Link>
          <Link href="/blog" className="not-found-link">Blog</Link>
          <Link href="/music" className="not-found-link">Music</Link>
          <Link href="/contact" className="not-found-link">Contact</Link>
        </nav>

        <div style={{ marginTop: '5rem', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center', pointerEvents: 'none' }} aria-hidden>
          {[160, 130, 100, 70, 40].map((w) => (
            <div key={w} className="not-found-groove" style={{ width: `${w}px` }} />
          ))}
        </div>
      </div>
    </>
  );
}
