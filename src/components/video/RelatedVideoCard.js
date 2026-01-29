import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const RelatedVideoCard = ({ video }) => {
  const publishedDate = new Date(video.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)" }}
      className="rounded-lg"
    >
      <Link href={`/video/${video.id}`} className="group flex items-start space-x-4 p-3 rounded-xl hover:bg-[var(--bg-secondary)] transition-all duration-300">
        {/* --- IMPROVEMENT: Thumbnail container with hover effect --- */}
        <div className="relative w-32 h-20 flex-shrink-0">
          <img
            src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
            alt={video.title}
            className="w-full h-full object-cover rounded-md"
          />
          {/* --- IMPROVEMENT: Play icon appears on hover --- */}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path>
            </svg>
          </div>
          {/* 
            SUGGESTION: If your 'video' object had a 'duration' property (e.g., "4:15"), 
            you could display it here for a better UX.
          */}
        </div>
        <div className="overflow-hidden pt-1">
          {/* --- IMPROVEMENT: Title truncates if too long --- */}
          <h4 className="text-sm font-semibold text-[var(--text-primary)] leading-tight line-clamp-2" title={video.title}>
            {video.title}
          </h4>
          <p className="text-xs text-[var(--text-tertiary)] mt-1.5 font-medium">Suvojeet Sengupta</p>
          {/* --- IMPROVEMENT: Dynamic published date --- */}
          <p className="text-[10px] text-[var(--text-muted)] mt-1 uppercase tracking-wider font-semibold">{publishedDate}</p>
          {/* 
            SUGGESTION: If you had 'viewCount', you could combine it here, 
            e.g., `${viewCount} views • ${publishedDate}` 
          */}
        </div>
      </Link>
    </motion.div>
  );
};

export default React.memo(RelatedVideoCard);
