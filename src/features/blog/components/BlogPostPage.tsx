import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/types/blog';
import { formatDate } from '@/lib/utils';
import { calculateReadingTime } from '@/lib/blog-utils';
import { CommentList } from './comments/CommentList';
import { LikeButton } from './LikeButton';
import { ShareButtons } from './ShareButtons';

interface BlogPostPageProps {
  post: BlogPost;
}

const hasImage = (url: string | null): url is string =>
  !!url && url.trim() !== '' && url.startsWith('http') && !url.includes('null') && !url.includes('undefined');

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="page !max-w-[820px]">
      <article>
        <Link href="/blog" className="text-link text-[14px] !border-transparent hover:!border-[color:var(--text-primary)]">
          ← Writing
        </Link>

        <header className="mt-10 mb-12">
          <p className="text-[14px] text-[color:var(--text-tertiary)] mb-5 flex flex-wrap gap-x-2">
            <span suppressHydrationWarning>{formatDate(post.publishedAt)}</span>
            <span aria-hidden="true">·</span>
            <span>{readingTime}</span>
            {post.category && (
              <>
                <span aria-hidden="true">·</span>
                <span>{post.category}</span>
              </>
            )}
          </p>
          <h1 className="text-[clamp(34px,5.4vw,58px)] leading-[1.06] tracking-[-0.03em] mb-6 break-words">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="font-serif text-[21px] leading-[1.5] text-[color:var(--text-secondary)]">
              {post.excerpt}
            </p>
          )}
        </header>

        {hasImage(post.imageUrl) && (
          <div className="mb-12 overflow-hidden rounded-[6px] relative aspect-[16/9]">
            <Image
              src={post.imageUrl}
              alt=""
              fill
              sizes="(max-width: 820px) 100vw, 740px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />

        <footer className="mt-14 pt-8 border-t border-[color:var(--line-strong)] space-y-8">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-5">
            <LikeButton
              slug={post.slug}
              initialLikes={post.likes}
              initialHasLiked={post.hasLiked ?? false}
            />
            <ShareButtons title={post.title} />
          </div>

          <div className="flex items-center gap-4 pt-8 border-t border-[color:var(--line)]">
            <img
              src="/portrait-720.webp"
              alt=""
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover object-top flex-shrink-0"
            />
            <div>
              <p className="text-[15px] text-[color:var(--text-primary)]">{post.author}</p>
              <p className="text-[14px]">
                Software developer and vocalist. <Link href="/about" className="text-link">More about me</Link>
              </p>
            </div>
          </div>
        </footer>

        <section className="mt-16">
          <CommentList
            initialComments={post.comments}
            initialCount={post.commentsCount || 0}
            postId={post.id}
            slug={post.slug}
            commentsEnabled={post.commentsEnabled}
          />
        </section>
      </article>
    </div>
  );
};

export default BlogPostPage;
