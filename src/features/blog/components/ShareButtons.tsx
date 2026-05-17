'use client';

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/common/Icons';

interface ShareButtonsProps {
  title: string;
  isSidebar?: boolean;
}

export function ShareButtons({ title, isSidebar }: ShareButtonsProps) {
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const shareTitle = `Check out this post: ${title}`;

  return (
    <div className="flex gap-2">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        className={isSidebar 
          ? "w-8 h-8 flex items-center justify-center border border-[color:var(--line-strong)] hover:border-[color:var(--neon)] transition-colors"
          : "w-10 h-10 flex items-center justify-center border border-[color:var(--line-strong)] hover:border-[color:var(--neon)] transition-colors"
        }
      >
        <Icons.Twitter className={isSidebar ? "w-3.5 h-3.5" : "w-4 h-4"} />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        className={isSidebar 
          ? "w-8 h-8 flex items-center justify-center border border-[color:var(--line-strong)] hover:border-[color:var(--neon)] transition-colors"
          : "w-10 h-10 flex items-center justify-center border border-[color:var(--line-strong)] hover:border-[color:var(--neon)] transition-colors"
        }
      >
        <Icons.Linkedin className={isSidebar ? "w-3.5 h-3.5" : "w-4 h-4"} />
      </a>
    </div>
  );
}
