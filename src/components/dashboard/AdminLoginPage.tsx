'use client';

import { apiUrl } from '@/lib/api-base';
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
        const res = await fetch(apiUrl('/api/admin/overview'), { 
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
      const response = await fetch(apiUrl('/api/admin/login'), {
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
    <div className="page min-h-[85vh] flex items-center">
      <div className="w-full max-w-sm">
        <p className="page-eyebrow">Admin</p>
        <h1 className="text-[clamp(34px,5vw,48px)] leading-none tracking-[-0.03em] mb-3">Sign in</h1>
        <p className="text-[15px]">Manage posts, comments, messages and music.</p>

        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="admin-email" className="v-label">Email</label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="v-input"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="v-label">Password</label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="v-input"
            />
          </div>

          {error && (
            <p role="alert" className="text-[14px] text-[color:var(--danger)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-solid w-full disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <Link href="/" className="text-link inline-block mt-10 text-[14px]">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
