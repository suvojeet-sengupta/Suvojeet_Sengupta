'use client';

import { useEffect, useRef, useState } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateProgress = () => {
      const article = articleRef.current;
      if (!article) {
        // fallback: track full page scroll
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
        return;
      }
      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = rect.height;
      const scrolled = window.scrollY - articleTop;
      const readable = articleHeight - window.innerHeight;
      setProgress(readable > 0 ? Math.min(Math.max((scrolled / readable) * 100, 0), 100) : 0);
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <>
      {/* Invisible sentinel the scroll tracker attaches to */}
      <div ref={articleRef} className="absolute inset-0 pointer-events-none" aria-hidden />
      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 right-0 z-[9998] h-[3px] pointer-events-none"
        style={{ background: 'var(--bg-tertiary)' }}
      >
        <div
          className="h-full transition-[width] duration-100"
          style={{ width: `${progress}%`, background: 'var(--neon)' }}
        />
      </div>
    </>
  );
}
