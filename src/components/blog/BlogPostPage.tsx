'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { BlogPost } from '@/types/blog';
import { formatDate, cn } from '@/lib/utils';
import { calculateReadingTime } from '@/lib/blog-utils';
import { Icons } from '../common/Icons';
import { CommentList } from './comments/CommentList';

interface BlogPostPageProps {
  post: BlogPost;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [hasLiked, setHasLiked] = useState(post.hasLiked || false);
  const [isLiking, setIsLiking] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    
    try {
      const response = await fetch(`/api/public/posts/${post.slug}/like`, {
        method: 'POST',
      });
      
      const data = await response.json();
      if (response.ok) {
        setHasLiked(data.liked);
        setLikes(prev => data.liked ? prev + 1 : Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const shareTitle = `Check out this post: ${post.title}`;
  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <article>
        {/* Category & Breadcrumb */}
        <div className="flex items-center gap-3 mb-8 overflow-hidden">
          <span className="bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-sm">
            {post.category || 'General'}
          </span>
          <div className="h-px w-8 bg-light" />
          <span className="text-muted text-[10px] font-black uppercase tracking-widest whitespace-nowrap" suppressHydrationWarning>
            {formatDate(post.publishedAt)}
          </span>
          <div className="h-px w-4 bg-light hidden md:block" />
          <span className="text-muted text-[10px] font-black uppercase tracking-widest hidden md:block">
            {readingTime}
          </span>
        </div>

        {/* Title Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-7xl font-black mb-6 uppercase tracking-tighter leading-[0.9] text-primary break-words">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-xl md:text-2xl text-secondary font-medium tracking-tight leading-snug">
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
           <div className="mb-16 rounded-sm overflow-hidden border border-light relative group aspect-[16/9] md:aspect-[21/9]">
             <Image
               src={post.imageUrl}
               alt={post.title}
               fill
               className="object-cover transition-transform duration-700 group-hover:scale-105"
               priority
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           </div>
        )}

        {/* Post Meta & Actions (Mobile) - Compact */}
        <div className="flex md:hidden flex-col gap-6 py-8 border-y border-light mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center font-black text-brand-orange">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest">{post.author}</p>
                <p className="text-[10px] text-muted font-bold uppercase tracking-wider">Writer & Editor</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 border rounded-sm transition-all font-bold text-xs uppercase tracking-widest",
                hasLiked ? "bg-red-50 border-red-200 text-red-500" : "bg-tertiary border-light hover:border-brand-orange"
              )}
            >
              <Icons.Heart className={cn("w-4 h-4", hasLiked && "fill-current")} />
              <span>{likes}</span>
            </button>
            <div className="flex gap-2">
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                className="w-10 h-10 flex items-center justify-center bg-tertiary border border-light rounded-sm hover:border-brand-orange transition-colors"
              >
                <Icons.Twitter className="w-4 h-4" />
              </a>
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                className="w-10 h-10 flex items-center justify-center bg-tertiary border border-light rounded-sm hover:border-brand-orange transition-colors"
              >
                <Icons.LinkedIn className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div 
              className="prose prose-lg prose-invert max-w-none 
              prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-primary
              prose-p:text-secondary prose-p:leading-relaxed prose-p:font-medium
              prose-a:text-brand-orange prose-a:no-underline hover:prose-a:underline
              prose-strong:text-primary prose-strong:font-black
              prose-img:rounded-sm prose-img:border prose-img:border-light
              prose-code:text-brand-orange prose-code:bg-tertiary prose-code:px-1 prose-code:py-0.5 prose-code:rounded-sm prose-code:before:content-none prose-code:after:content-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <div className="mt-16 pt-8 border-t border-light flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-wrap gap-2">
                {post.tags && post.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-muted bg-tertiary px-2 py-1 border border-light rounded-sm">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="hidden md:flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted">Share Post</span>
                <div className="flex gap-2">
                  <a 
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    className="w-8 h-8 flex items-center justify-center bg-tertiary border border-light rounded-sm hover:border-brand-orange transition-colors"
                  >
                    <Icons.Twitter className="w-3.5 h-3.5" />
                  </a>
                  <a 
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    className="w-8 h-8 flex items-center justify-center bg-tertiary border border-light rounded-sm hover:border-brand-orange transition-colors"
                  >
                    <Icons.LinkedIn className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (Desktop) */}
          <aside className="hidden md:block w-72 flex-shrink-0 space-y-12">
            <div className="sticky top-32 space-y-12">
              {/* Author Card */}
              <div className="professional-card !p-6 bg-tertiary">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center font-black text-brand-orange">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black uppercase tracking-widest text-sm">{post.author}</h4>
                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Lead Writer</p>
                  </div>
                </div>
                <p className="text-xs text-secondary leading-relaxed mb-6 font-medium">
                  Sharing insights on technology, music, and the creative intersection of both.
                </p>
                <div className="pt-6 border-t border-light/50">
                   <button 
                    onClick={handleLike}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 py-3 border rounded-sm transition-all font-bold text-xs uppercase tracking-widest",
                      hasLiked ? "bg-red-50 border-red-200 text-red-500" : "bg-background border-light hover:border-brand-orange"
                    )}
                  >
                    <Icons.Heart className={cn("w-4 h-4", hasLiked && "fill-current")} />
                    <span>{likes} Likes</span>
                  </button>
                </div>
              </div>

              {/* Reading Stats */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Post Info</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-light/30">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Views</span>
                    <span className="text-xs font-black">{post.views || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-light/30">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Reading Time</span>
                    <span className="text-xs font-black">{readingTime}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-light/30">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Comments</span>
                    <span className="text-xs font-black">{post.commentsCount || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Comments Section */}
        <section className="mt-20 pt-16 border-t border-light">
          <CommentList postSlug={post.slug} initialCommentsCount={post.commentsCount || 0} />
        </section>
      </article>
    </div>
  );
};

export default BlogPostPage;
