'use client';

import { FormEvent, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/admin/overview', { 
          cache: 'no-store',
          credentials: 'include'
        });
        if (res.ok) {
          router.push('/dashboard');
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      let payload: { error?: string } = {};
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        payload = await response.json() as { error?: string };
      } else {
        const rawText = await response.text();
        payload = { error: rawText || 'Login failed.' };
      }

      if (!response.ok) {
        setError(payload.error || 'Login failed.');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
      setLoading(false);
    } catch (submitError) {
      console.error(submitError);
      setError('Unable to login right now.');
      setLoading(false);
    }
  };

  return (
    <section className="section-container">
      <div className="max-w-md mx-auto professional-card p-7 sm:p-9">
        <div className="v-section-num">Studio · Admin</div>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
          Dashboard <em className="text-[color:var(--neon)] not-italic font-black italic">Login</em>
        </h1>
        <p className="text-sm sm:text-base text-[color:var(--text-secondary)] opacity-80 leading-relaxed">
          Use your secure admin credentials to manage blog posts, comments, and activity stats.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="admin-email" className="v-label">Email</label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="v-input"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="v-label">Password</label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="v-input"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-red-500 p-3 border border-red-500/30">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-solid w-full disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <Link
          href="/blog"
          className="inline-block mt-7 font-mono text-[11px] uppercase tracking-[0.2em] font-bold text-[color:var(--neon)] hover:text-[color:var(--ember)] transition-colors"
        >
          ← Back to Blog
        </Link>
      </div>
    </section>
  );
}
