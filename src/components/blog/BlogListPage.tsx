'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { BlogSummary } from '@/types/blog';
import { FormattedDate } from '@/components/common/FormattedDate';

interface PostsResponse {
  posts: BlogSummary[];
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch('/api/public/posts', { cache: 'no-store' });
        const payload = await response.json() as PostsResponse & { error?: string };

        if (!response.ok) {
          setError(payload.error || 'Unable to load blog posts right now.');
          setLoading(false);
          return;
        }

        setPosts(payload.posts || []);
        setLoading(false);
      } catch (fetchError) {
        console.error(fetchError);
        setError('Unable to load blog posts right now.');
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <section className="section-container pt-32 pb-24">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted mb-4">Blog</p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">Latest Posts</h1>
        <p className="mt-4 max-w-3xl">
          Read long-form updates, learnings, and insights from my journey in software development and music.
        </p>
      </div>

      {loading && <p className="text-secondary">Loading posts...</p>}
      {!loading && error && <p className="text-red-500 font-medium">{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <div className="border border-light rounded-sm p-8 bg-tertiary">
          <h2 className="text-2xl font-bold">No posts yet</h2>
          <p className="mt-3">Your first article will appear here once it is published from the dashboard.</p>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="border border-light rounded-sm bg-tertiary p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider">
                  {post.category && (
                    <span className="bg-brand-orange text-white px-3 py-1 rounded-sm">{post.category}</span>
                  )}
                  <span className="text-muted"><FormattedDate date={post.publishedAt} /></span>
                </div>

                <h2 className="text-2xl font-black leading-tight">{post.title}</h2>
                <p className="mt-4">{post.excerpt || 'Open the post to read full details.'}</p>

                {post.tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={`${post.id}-${tag}`}
                        className="text-xs border border-light px-2 py-1 rounded-sm text-secondary"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="text-xs text-muted uppercase tracking-wider">
                  {post.views} views • {post.commentsCount} comments
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="bg-brand-orange hover:bg-orange-700 text-white px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-wider"
                >
                  Read post
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
