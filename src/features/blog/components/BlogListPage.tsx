'use client';

import Link from 'next/link';
import type { BlogSummary } from '@/types/blog';
import { FormattedDate } from '@/components/common/FormattedDate';
import { useBlogPosts } from '../api/useBlogApi';
import BlogCardSkeleton from './BlogCardSkeleton';

export default function BlogListPage({ initialPosts }: { initialPosts: BlogSummary[] }) {
  const { data: posts, isLoading, error } = useBlogPosts(initialPosts);

  return (
    <div className="page">
      <header className="max-w-3xl">
        <p className="page-eyebrow">Writing</p>
        <h1 className="page-title">Notes on building software and making music</h1>
        <p className="page-lede">
          What I&apos;m learning about backend development, Android and singing, written
          down as I go.
        </p>
      </header>

      {error && (
        <p role="alert" className="mt-10 text-[15px] text-[#c2553b]">
          {error instanceof Error ? error.message : 'Unable to load posts right now.'}
        </p>
      )}

      <ol className="mt-16 border-t border-[color:var(--line-strong)]">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <BlogCardSkeleton key={i} />)
        ) : posts && posts.length > 0 ? (
          posts.map((post) => <BlogRow key={post.id} post={post} />)
        ) : (
          <li className="py-12">
            <h2 className="text-[26px] mb-2">No posts yet</h2>
            <p className="text-[16px]">The first post will appear here once it&apos;s published.</p>
          </li>
        )}
      </ol>
    </div>
  );
}

function BlogRow({ post }: { post: BlogSummary }) {
  return (
    <li className="border-b border-[color:var(--line)]">
      <Link
        href={`/blog/${post.slug}`}
        className="grid gap-x-10 gap-y-3 py-9 md:grid-cols-[160px_minmax(0,1fr)] group"
      >
        <div className="text-[14px] text-[color:var(--text-tertiary)] md:pt-2 flex md:flex-col gap-x-3 gap-y-1">
          <FormattedDate date={post.publishedAt} />
          {post.category && <span className="text-[color:var(--text-muted)]">{post.category}</span>}
        </div>
        <div className="min-w-0">
          <h2 className="text-[clamp(24px,2.6vw,32px)] leading-tight mb-3 group-hover:underline underline-offset-[6px] decoration-1">
            {post.title}
          </h2>
          {post.excerpt && <p className="text-[16px] max-w-2xl">{post.excerpt}</p>}
          <p className="mt-4 text-[13px] text-[color:var(--text-muted)]">
            {post.views} views · {post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}
            {post.tags.length > 0 && <> · {post.tags.join(', ')}</>}
          </p>
        </div>
      </Link>
    </li>
  );
}
