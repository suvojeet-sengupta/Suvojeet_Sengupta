'use client';

import React, { useState, useEffect } from 'react';
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
      // Note: Backend uses id or slug depending on the route. 
      // Based on route.ts seen earlier, it uses slug as rawId but treats it as Number(slug).
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
          <div className="mb-16 rounded-sm overflow-hidden border border-light relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-auto aspect-[16/9] md:aspect-[21/9] object-cover transition-transform duration-700 group-hover:scale-105"
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
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">Author</p>
                <p className="font-bold text-sm text-primary">{post.author}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted">Read Time</p>
              <p className="font-bold text-sm text-primary">{readingTime}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-light/50">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted mb-1">Views</p>
                <p className="font-black text-lg tracking-tighter">{post.views}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted mb-1">Likes</p>
                <button 
                  onClick={handleLike}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full border transition-all active:scale-95",
                    hasLiked 
                      ? "bg-brand-orange/10 border-brand-orange text-brand-orange" 
                      : "bg-tertiary border-light text-secondary hover:border-brand-orange hover:text-brand-orange"
                  )}
                >
                  <Icons.Heart className={cn("w-4 h-4", hasLiked && "fill-current")} />
                  <span className="font-black text-sm">{likes}</span>
                </button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="w-10 h-10 rounded-full bg-tertiary border border-light flex items-center justify-center text-muted"
              >
                <Icons.Description className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Post Meta & Actions (Desktop) - Sophisticated */}
        <div className="hidden md:flex items-center justify-between py-8 border-y border-light mb-16">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-tertiary border border-light flex items-center justify-center font-black text-lg text-brand-orange">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted leading-tight">Written By</p>
                <p className="font-black text-primary text-lg">{post.author}</p>
              </div>
            </div>
            
            <div className="h-10 w-px bg-light" />
            
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted leading-tight">Views</p>
              <p className="font-black text-primary text-lg tracking-tighter">{post.views.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted leading-tight">Reading Time</p>
              <p className="font-black text-primary text-lg tracking-tighter">{readingTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              className={cn(
                "group flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all duration-300",
                hasLiked 
                  ? "bg-brand-orange border-brand-orange text-white shadow-lg shadow-brand-orange/20" 
                  : "bg-transparent border-light text-secondary hover:border-brand-orange hover:text-brand-orange"
              )}
            >
              <Icons.Heart className={cn("w-5 h-5 transition-transform group-hover:scale-125", hasLiked && "fill-current")} />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{hasLiked ? 'Liked' : 'Like'}</span>
                <span className="font-black text-xl tracking-tighter">{likes}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div 
          className="prose prose-invert prose-orange max-w-none mb-20 whitespace-pre-wrap
          prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-primary
          prose-h2:text-3xl md:prose-h2:text-5xl prose-h2:mt-16 prose-h2:mb-8
          prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:mt-12 prose-h3:mb-6
          prose-p:text-secondary prose-p:leading-[1.8] prose-p:text-lg md:prose-p:text-xl prose-p:mb-8
          prose-strong:text-primary prose-strong:font-black
          prose-a:text-brand-orange prose-a:no-underline prose-a:font-bold border-b border-brand-orange/30 hover:border-brand-orange transition-all
          prose-img:rounded-sm prose-img:border prose-img:border-light prose-img:my-12 prose-img:mx-auto
          prose-blockquote:border-l-4 prose-blockquote:border-brand-orange prose-blockquote:bg-brand-orange/5 prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:italic prose-blockquote:text-xl
          prose-ul:my-8 prose-li:text-secondary prose-li:text-lg md:prose-li:text-xl prose-li:mb-2
          prose-code:text-brand-orange prose-code:bg-brand-orange/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:before:content-none prose-code:after:content-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-16 py-8 border-y border-light">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted mr-2 flex items-center">Tags:</span>
            {post.tags.map(tag => (
              <span key={tag} className="text-[10px] font-black uppercase tracking-widest bg-tertiary border border-light px-4 py-2 rounded-full text-secondary hover:border-brand-orange hover:text-brand-orange transition-colors cursor-default">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer Actions & Share */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20 bg-tertiary p-8 rounded-sm border border-light">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Did you enjoy this?</h3>
            <p className="text-muted text-sm">Share it with your network or leave a like.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank" rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-background border border-light flex items-center justify-center hover:border-brand-orange hover:text-brand-orange transition-all hover:-translate-y-1"
                title="Share on Twitter"
              >
                <Icons.Twitter className="w-5 h-5" />
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank" rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-background border border-light flex items-center justify-center hover:border-brand-orange hover:text-brand-orange transition-all hover:-translate-y-1"
                title="Share on Facebook"
              >
                <Icons.Facebook className="w-5 h-5" />
              </a>
              <a 
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`}
                target="_blank" rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-background border border-light flex items-center justify-center hover:border-brand-orange hover:text-brand-orange transition-all hover:-translate-y-1"
                title="Share on WhatsApp"
              >
                <Icons.WhatsApp className="w-5 h-5" />
              </a>
            </div>
            
            <div className="h-8 w-px bg-light mx-2" />
            
            <button 
              onClick={handleLike}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all active:scale-95",
                hasLiked 
                  ? "bg-brand-orange border-brand-orange text-white" 
                  : "bg-background border-light text-secondary hover:border-brand-orange"
              )}
            >
              <Icons.Heart className={cn("w-5 h-5", hasLiked && "fill-current")} />
              <span className="font-black">{likes}</span>
            </button>
          </div>
        </div>
      </article>

      {/* COMMENTS SECTION */}
      <CommentList 
        initialComments={post.comments}
        initialCount={post.commentsCount}
        postId={post.id}
        commentsEnabled={post.commentsEnabled}
      />
    </div>
  );
};

export default BlogPostPage;
