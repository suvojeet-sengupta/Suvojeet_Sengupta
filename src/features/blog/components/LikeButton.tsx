'use client';

import React, { useState } from 'react';
import { Icons } from '@/components/common/Icons';
import { cn } from '@/lib/utils';
import { useLikePost } from '../api/useBlogApi';

interface LikeButtonProps {
  slug: string;
  initialLikes: number;
  initialHasLiked: boolean;
  isSidebar?: boolean;
}

export function LikeButton({ slug, initialLikes, initialHasLiked, isSidebar }: LikeButtonProps) {
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
      className={cn(
        "flex items-center justify-center gap-2 py-2.5 border font-mono text-[11px] uppercase tracking-[0.2em] font-bold transition-all",
        isSidebar ? "w-full" : "flex-1",
        hasLiked ? "bg-[color:var(--neon)]/10 border-[color:var(--neon)] text-[color:var(--neon)]" : "border-[color:var(--line-strong)] hover:border-[color:var(--neon)]"
      )}
    >
      <Icons.Heart className={cn("w-4 h-4", hasLiked && "fill-current")} />
      <span>{likes} {isSidebar ? 'Likes' : ''}</span>
    </button>
  );
}
