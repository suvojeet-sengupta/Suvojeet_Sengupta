'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { BlogPost } from '@/types/blog';
import { formatDate, cn } from '@/lib/utils';
import { calculateReadingTime } from '@/lib/blog-utils';
import { Icons } from '@/components/common/Icons';
import { CommentList } from './comments/CommentList';
import { useLikePost } from '../api/useBlogApi';

interface BlogPostPageProps {
  post: BlogPost;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [localLikes, setLocalLikes] = useState(post.likes);
  const [localHasLiked, setLocalHasLiked] = useState(post.hasLiked);
  
  const { mutate: likePost } = useLikePost(post.slug);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const handleLike = () => {
    const newHasLiked = !localHasLiked;
    setLocalHasLiked(newHasLiked);
    setLocalLikes(prev => newHasLiked ? prev + 1 : Math.max(0, prev - 1));

    likePost(undefined, {
      onError: () => {
        setLocalHasLiked(!newHasLiked);
        setLocalLikes(prev => !newHasLiked ? prev + 1 : Math.max(0, prev - 1));
      }
    });
  };

  const shareTitle = `Check out this post: ${post.title}`;
  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-6 pt-28 sm:pt-32 pb-16">
      <article>
        {/* Category & Breadcrumb */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="v-pill v-pill-neon">
            {post.category || 'General'}
          </span>
          <div className="h-px w-6 bg-[color:var(--line-strong)]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--text-muted)] whitespace-nowrap" suppressHydrationWarning>
            {formatDate(post.publishedAt)}
          </span>
          <div className="h-px w-4 bg-[color:var(--line-strong)] hidden md:block" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--text-muted)] hidden md:block">
            {readingTime}
          </span>
        </div>

        {/* Title Section */}
        <div className="mb-10 sm:mb-12">
          <h1 className="font-serif font-light leading-[0.95] tracking-tight mb-6 text-[clamp(36px,7vw,84px)] break-words text-[color:var(--text-primary)]">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="font-serif text-lg sm:text-xl md:text-2xl text-[color:var(--text-secondary)] opacity-85 leading-snug max-w-3xl">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Hero Image */}
        {post.imageUrl &&
          post.imageUrl.trim() !== '' &&
          !post.imageUrl.includes('null') &&
          !post.imageUrl.includes('undefined') &&
          post.imageUrl.startsWith('http') && (
           <div className="mb-12 sm:mb-16 overflow-hidden border border-[color:var(--line-strong)] relative group aspect-[16/9] md:aspect-[21/9]">
             <Image
               src={post.imageUrl}
               alt={post.title}
               fill
               className="object-cover transition-transform duration-700 group-hover:scale-105"
               priority
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           </div>
        )}

        {/* Post Meta & Actions (Mobile) */}
        <div className="flex md:hidden flex-col gap-5 py-6 border-y border-[color:var(--line-strong)] mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[color:var(--accent-subtle)] border border-[color:var(--neon)]/30 flex items-center justify-center font-serif font-black text-[color:var(--neon)]">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="font-serif text-sm font-semibold">{post.author}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-muted)] mt-1">Writer & Editor</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 border font-mono text-[11px] uppercase tracking-[0.2em] font-bold transition-all",
                localHasLiked ? "bg-[color:var(--neon)]/10 border-[color:var(--neon)] text-[color:var(--neon)]" : "border-[color:var(--line-strong)] hover:border-[color:var(--neon)]"
              )}
            >
              <Icons.Heart className={cn("w-4 h-4", localHasLiked && "fill-current")} />
              <span>{localLikes}</span>
            </button>
            <div className="flex gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                className="w-10 h-10 flex items-center justify-center border border-[color:var(--line-strong)] hover:border-[color:var(--neon)] transition-colors"
              >
                <Icons.Twitter className="w-4 h-4" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                className="w-10 h-10 flex items-center justify-center border border-[color:var(--line-strong)] hover:border-[color:var(--neon)] transition-colors"
              >
                <Icons.Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div
              className="prose prose-lg max-w-none
              prose-headings:font-serif prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[color:var(--text-primary)]
              prose-p:text-[color:var(--text-secondary)] prose-p:leading-relaxed
              prose-a:text-[color:var(--neon)] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[color:var(--text-primary)] prose-strong:font-semibold
              prose-img:border prose-img:border-[color:var(--line-strong)]
              prose-blockquote:border-l-2 prose-blockquote:border-[color:var(--neon)] prose-blockquote:not-italic prose-blockquote:font-serif
              prose-code:text-[color:var(--neon)] prose-code:bg-[color:var(--bg-secondary)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-none prose-code:font-mono prose-code:before:content-none prose-code:after:content-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-14 pt-7 border-t border-[color:var(--line-strong)] flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex flex-wrap gap-2">
                {post.tags && post.tags.map(tag => (
                  <span key={tag} className="v-pill">#{tag}</span>
                ))}
              </div>

              <div className="hidden md:flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--text-muted)]">Share</span>
                <div className="flex gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    className="w-8 h-8 flex items-center justify-center border border-[color:var(--line-strong)] hover:border-[color:var(--neon)] transition-colors"
                  >
                    <Icons.Twitter className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    className="w-8 h-8 flex items-center justify-center border border-[color:var(--line-strong)] hover:border-[color:var(--neon)] transition-colors"
                  >
                    <Icons.Linkedin className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (Desktop) */}
          <aside className="hidden md:block w-72 flex-shrink-0 space-y-10">
            <div className="sticky top-32 space-y-10">
              {/* Author Card */}
              <div className="professional-card">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[color:var(--accent-subtle)] border border-[color:var(--neon)]/30 flex items-center justify-center font-serif font-black text-[color:var(--neon)] text-lg">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-base">{post.author}</h4>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-muted)] mt-1">Lead Writer</p>
                  </div>
                </div>
                <p className="text-sm text-[color:var(--text-secondary)] opacity-80 leading-relaxed mb-5">
                  Sharing insights on technology, music, and the creative intersection of both.
                </p>
                <div className="pt-5 border-t border-[color:var(--line)]">
                  <button
                    onClick={handleLike}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 py-2.5 border font-mono text-[11px] uppercase tracking-[0.2em] font-bold transition-all",
                      localHasLiked ? "bg-[color:var(--neon)]/10 border-[color:var(--neon)] text-[color:var(--neon)]" : "border-[color:var(--line-strong)] hover:border-[color:var(--neon)]"
                    )}
                  >
                    <Icons.Heart className={cn("w-4 h-4", localHasLiked && "fill-current")} />
                    <span>{localLikes} Likes</span>
                  </button>
                </div>
              </div>

              {/* Reading Stats */}
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--neon)] mb-4">Post Info</h4>
                <div className="space-y-1">
                  {[
                    { label: 'Views', value: post.views || 0 },
                    { label: 'Reading Time', value: readingTime },
                    { label: 'Comments', value: post.commentsCount || 0 },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center py-2.5 border-b border-[color:var(--line)]">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-muted)]">{row.label}</span>
                      <span className="font-mono text-xs font-bold tabular-nums">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Comments Section */}
        <section className="mt-16 pt-14 border-t border-[color:var(--line-strong)]">
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
