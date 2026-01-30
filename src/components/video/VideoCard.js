import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Icons } from '../common/Icons';
import { cn } from '@/lib/utils';

const VideoCard = ({ video }) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const publishedDate = new Date(video.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const isNew = (new Date() - new Date(video.publishedAt)) < 7 * 24 * 60 * 60 * 1000;

  return (
    <Link href={`/video/${video.id}`}>
      <motion.div
        key={video.id}
        className="card-elevated rounded-2xl overflow-hidden group cursor-pointer"
        variants={itemVariants}
        whileHover={{
          y: -8,
          boxShadow: "0 20px 40px rgba(99, 102, 241, 0.15)",
          transition: { duration: 0.3 }
        }}
      >
        {/* Thumbnail */}
        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            src={`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <motion.div
              className="w-16 h-16 rounded-full bg-[var(--accent-primary)] flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icons.Play className="w-7 h-7 text-white ml-1" />
            </motion.div>
          </div>

          {/* Duration badge (placeholder) & New Badge */}
          <div className="absolute bottom-3 right-3 flex gap-2">
            {isNew && (
              <span className="px-2 py-1 rounded-md bg-[var(--accent-primary)] text-white text-xs font-bold shadow-lg">
                NEW
              </span>
            )}
            <span className="px-2 py-1 rounded-md bg-black/70 text-white text-xs font-medium backdrop-blur-sm">
              HD
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 line-clamp-2 group-hover:text-[var(--accent-primary)] transition-colors">
            {video.title}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1">
              <Icons.Calendar className="w-3 h-3" />
              {publishedDate}
            </span>
          </div>

          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">
            {video.description ? video.description.substring(0, 100) + '...' : 'Watch now on YouTube'}
          </p>

          <div className="flex items-center gap-2 text-[var(--accent-primary)] font-medium text-sm group-hover:gap-3 transition-all">
            <span>Watch Now</span>
            <Icons.ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default React.memo(VideoCard);