import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="card-elevated rounded-2xl overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-video bg-[var(--bg-tertiary)] animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skeleton-shimmer" />
      </div>

      {/* Content skeleton */}
      <div className="p-5">
        {/* Title */}
        <div className="h-5 bg-[var(--bg-tertiary)] rounded-lg w-4/5 mb-3 animate-pulse" />

        {/* Date */}
        <div className="h-3 bg-[var(--bg-tertiary)] rounded w-24 mb-4 animate-pulse" />

        {/* Description lines */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-[var(--bg-tertiary)] rounded w-full animate-pulse" />
          <div className="h-3 bg-[var(--bg-tertiary)] rounded w-5/6 animate-pulse" />
        </div>

        {/* Button */}
        <div className="h-4 bg-[var(--bg-tertiary)] rounded w-24 animate-pulse" />
      </div>
    </div>
  );
};

export default SkeletonCard;