'use client';

import React, { useState } from 'react';
import { Icons } from '@/components/common/Icons';
import { cn } from '@/lib/utils';
import { useLikePost } from '../api/useBlogApi';

interface LikeButtonProps {
  slug: string;
  initialLikes: number;
  initialHasLiked: boolean;
}

export function LikeButton({ slug, initialLikes, initialHasLiked }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const { mutate: likePost } = useLikePost(slug);

  const handleLike = () => {
    const newHasLiked = !hasLiked;
    setHasLiked(newHasLiked);
    setLikes(prev => newHasLiked ? prev + 1 : Math.max(0, prev - 1));

    likePost(undefined, {
      onError: () => {
        setHasLiked(!newHasLiked);
        setLikes(prev => !newHasLiked ? prev + 1 : Math.max(0, prev - 1));
      }
    });
  };

  return (
    <button
      onClick={handleLike}
      aria-pressed={hasLiked}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[14px] transition-colors",
        hasLiked
          ? "border-[color:var(--text-primary)] text-[color:var(--text-primary)]"
          : "border-[color:var(--line-strong)] text-[color:var(--text-secondary)] hover:border-[color:var(--text-primary)]"
      )}
    >
      <Icons.Heart className={cn("w-4 h-4", hasLiked && "fill-current")} />
      <span>{likes} {likes === 1 ? 'like' : 'likes'}</span>
    </button>
  );
}
