import React from 'react';

const BlogCardSkeleton = () => (
  <div className="professional-card animate-pulse">
    <div className="flex gap-2 mb-4">
      <div className="h-5 w-20 bg-[color:var(--bg-tertiary)]" />
      <div className="h-5 w-16 bg-[color:var(--bg-tertiary)]" />
    </div>
    <div className="h-7 bg-[color:var(--bg-tertiary)] w-11/12 mb-3" />
    <div className="space-y-2 mb-5">
      <div className="h-4 bg-[color:var(--bg-tertiary)] w-full" />
      <div className="h-4 bg-[color:var(--bg-tertiary)] w-4/5" />
    </div>
    <div className="pt-5 border-t border-[color:var(--line)] flex justify-between">
      <div className="h-3 w-32 bg-[color:var(--bg-tertiary)]" />
      <div className="h-3 w-12 bg-[color:var(--bg-tertiary)]" />
    </div>
  </div>
);

export default BlogCardSkeleton;
