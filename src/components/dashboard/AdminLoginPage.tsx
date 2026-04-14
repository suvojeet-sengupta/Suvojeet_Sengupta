'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
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
    <section className="section-container pt-32 pb-24">
      <div className="max-w-lg mx-auto border border-light rounded-sm p-8 bg-tertiary">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted mb-3">Admin</p>
        <h1 className="text-3xl font-black">Dashboard Login</h1>
        <p className="mt-3">
          Use your secure admin credentials to manage blog posts, comments, and activity stats.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="admin-email" className="text-sm font-bold uppercase tracking-wider">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full border border-light rounded-sm px-4 py-3 bg-background"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="text-sm font-bold uppercase tracking-wider">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full border border-light rounded-sm px-4 py-3 bg-background"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-orange hover:bg-orange-700 disabled:opacity-60 text-white font-bold uppercase tracking-wider py-3 rounded-sm"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <Link href="/blog" className="inline-block mt-5 text-sm text-brand-orange font-bold uppercase tracking-wider">
          ← Back to Blog
        </Link>
      </div>
    </section>
  );
}
