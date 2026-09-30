import React from 'react';

const BlogCardSkeleton = () => (
  <li className="border-b border-[color:var(--line)] py-9 grid gap-x-10 gap-y-3 md:grid-cols-[160px_minmax(0,1fr)] animate-pulse" aria-hidden="true">
    <div className="h-4 w-24 bg-[color:var(--bg-tertiary)] rounded" />
    <div>
      <div className="h-7 w-3/4 bg-[color:var(--bg-tertiary)] rounded mb-4" />
      <div className="h-4 w-full max-w-xl bg-[color:var(--bg-tertiary)] rounded mb-2" />
      <div className="h-4 w-2/3 max-w-md bg-[color:var(--bg-tertiary)] rounded" />
    </div>
  </li>
);

export default BlogCardSkeleton;
