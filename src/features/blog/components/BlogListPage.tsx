'use client';

import Link from 'next/link';
import type { BlogSummary } from '@/types/blog';
import { FormattedDate } from '@/components/common/FormattedDate';
import { useBlogPosts } from '../api/useBlogApi';
import BlogCardSkeleton from './BlogCardSkeleton';

export default function BlogListPage({ initialPosts }: { initialPosts: BlogSummary[] }) {
  const { data: posts, isLoading, error } = useBlogPosts(initialPosts);

  return (
    <section className="section-container">
      <div className="mb-12 sm:mb-16">
        <div className="v-tag mb-7">Side B · Liner Notes</div>
        <h1 className="v-section-title mb-5">
          Latest <em>Posts</em>
        </h1>
        <p className="max-w-2xl text-base sm:text-lg text-[color:var(--text-secondary)] opacity-80 leading-relaxed">
          Long-form updates, learnings, and insights from the studio — software, music, and the overlap.
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 border border-red-500/40 bg-red-500/5 text-red-500 font-mono text-sm">
          {error instanceof Error ? error.message : 'Unable to load blog posts right now.'}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <BlogCardSkeleton key={i} />)
        ) : posts && posts.length > 0 ? (
          posts.map((post) => <BlogCard key={post.id} post={post} />)
        ) : (
          <div className="col-span-full professional-card text-center py-12">
            <h2 className="font-serif text-2xl font-semibold mb-3">No posts yet</h2>
            <p className="text-[color:var(--text-secondary)] opacity-75">
              The first article will appear here once published from the dashboard.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: BlogSummary }) {
  return (
    <article className="professional-card flex flex-col justify-between group">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-4 font-mono text-[10px] uppercase tracking-[0.2em]">
          {post.category && <span className="v-pill v-pill-neon">{post.category}</span>}
          <span className="text-[color:var(--text-muted)]">
            <FormattedDate date={post.publishedAt} />
          </span>
        </div>

        <h2 className="font-serif text-xl sm:text-2xl font-semibold leading-tight mb-3 group-hover:text-[color:var(--neon)] transition-colors">
          {post.title}
        </h2>
        <p className="text-sm sm:text-base text-[color:var(--text-secondary)] opacity-80 leading-relaxed">
          {post.excerpt || 'Open the post to read full details.'}
        </p>

        {post.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={`${post.id}-${tag}`} className="v-pill">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 pt-5 border-t border-[color:var(--line)] flex items-center justify-between gap-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
          {post.views} views · {post.commentsCount} comments
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="font-mono text-[11px] uppercase tracking-[0.2em] font-bold text-[color:var(--neon)] hover:text-[color:var(--ember)] transition-colors"
        >
          Read →
        </Link>
      </div>
    </article>
  );
}
