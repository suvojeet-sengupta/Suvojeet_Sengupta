import React from 'react';
import uiStyles from './UI.module.css';

const SkeletonCard = () => {
  return (
    <div className={uiStyles.professionalCard + " overflow-hidden border-light"}>
      {/* Image skeleton */}
      <div className="aspect-video bg-tertiary animate-pulse relative overflow-hidden rounded-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent skeleton-shimmer" />
      </div>

      {/* Content skeleton */}
      <div className="py-5">
        {/* Title */}
        <div className="h-6 bg-tertiary rounded-sm w-4/5 mb-4 animate-pulse" />

        {/* Description lines */}
        <div className="space-y-2 mb-6">
          <div className="h-3 bg-tertiary rounded-sm w-full animate-pulse" />
          <div className="h-3 bg-tertiary rounded-sm w-5/6 animate-pulse" />
        </div>

        {/* Button skeleton */}
        <div className="h-4 bg-tertiary rounded-sm w-32 animate-pulse border-b-2 border-tertiary" />
      </div>
    </div>
  );
};

export default SkeletonCard;
