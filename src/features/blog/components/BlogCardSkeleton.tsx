import React from 'react';

const BlogCardSkeleton = () => {
  return (
    <div className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden transition-all duration-300">
      {/* Date & Tag skeleton */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
        <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
      </div>

      {/* Image skeleton */}
      <div className="aspect-[16/10] bg-zinc-200 dark:bg-zinc-800 animate-pulse" />

      {/* Content skeleton */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="h-7 bg-zinc-200 dark:bg-zinc-800 rounded-md w-11/12 mb-3 animate-pulse" />
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-full animate-pulse" />
          <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-4/5 animate-pulse" />
        </div>
        <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
      </div>
    </div>
  );
};

export default BlogCardSkeleton;
