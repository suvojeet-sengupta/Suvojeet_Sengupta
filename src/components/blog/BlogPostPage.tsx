'use client';

import React, { useState } from 'react';
import type { BlogPost } from '@/types/blog';
import { formatDate } from '@/lib/utils';
import { Icons } from '../common/Icons';
import { CommentList } from './comments/CommentList';

interface BlogPostPageProps {
  post: BlogPost;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [hasLiked, setHasLiked] = useState(post.hasLiked || false);

  const handleLike = async () => {
    if (hasLiked) return;
    
    try {
      const response = await fetch(`/api/public/posts/${post.slug}/like`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setLikes(prev => prev + 1);
        setHasLiked(true);
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = `Check out this post: ${post.title}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <article>
        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-brand-orange/10 text-brand-orange text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
            {post.category || 'General'}
          </span>
          <span className="text-muted text-xs font-bold uppercase tracking-widest" suppressHydrationWarning>
            {formatDate(post.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter leading-none">
          {post.title}
        </h1>

        {/* Hero Image */}
        {post.imageUrl && 
         post.imageUrl.trim() !== '' && 
         !post.imageUrl.includes('null') && 
         !post.imageUrl.includes('undefined') && 
         post.imageUrl.startsWith('http') && (
          <div className="mb-12 rounded-sm overflow-hidden border border-light">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-auto aspect-video object-cover"
            />
          </div>
        )}

        {/* Post Meta */}
        <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-light mb-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-tertiary border border-light flex items-center justify-center font-black">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-muted">Written By</p>
              <p className="font-bold text-primary">{post.author}</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">Views</p>
              <p className="font-black text-xl tracking-tighter">{post.views}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">Likes</p>
              <button 
                onClick={handleLike}
                disabled={hasLiked}
                className={`font-black text-xl tracking-tighter flex items-center gap-2 transition-colors ${hasLiked ? 'text-brand-orange' : 'hover:text-brand-orange'}`}
              >
                {likes}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div 
          className="prose prose-invert prose-orange max-w-none mb-16 
          prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter
          prose-p:text-secondary prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6
          prose-strong:text-primary prose-strong:font-black
          prose-a:text-brand-orange prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-sm prose-img:border prose-img:border-light prose-img:my-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {post.tags.map(tag => (
              <span key={tag} className="text-[10px] font-black uppercase tracking-widest border border-light px-3 py-1 rounded-sm text-muted">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Share Section */}
        <div className="border-t border-light pt-8 mb-16">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted mb-4">Share this post</h3>
          <div className="flex gap-4">
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-sm bg-tertiary border border-light flex items-center justify-center hover:border-brand-orange transition-colors"
              title="Share on Twitter"
            >
              <Icons.Twitter className="w-4 h-4" />
            </a>
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-sm bg-tertiary border border-light flex items-center justify-center hover:border-brand-orange transition-colors"
              title="Share on Facebook"
            >
              <Icons.Facebook className="w-4 h-4" />
            </a>
            <a 
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`}
              target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-sm bg-tertiary border border-light flex items-center justify-center hover:border-brand-orange transition-colors"
              title="Share on WhatsApp"
            >
              <Icons.WhatsApp className="w-4 h-4" />
            </a>
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
