import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GenerativePlaceholder from '../common/GenerativePlaceholder';

const BlogPostCard = ({ post }) => {
  const { title, slug, featuredImage, publishedAt } = post.fields;

  const publishedDate = publishedAt ? new Date(publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  }) : '';

  return (
    <motion.div
      className="card-elevated rounded-xl overflow-hidden group"
      whileHover={{
        y: -6,
        boxShadow: "0 15px 30px rgba(99, 102, 241, 0.12)",
        transition: { duration: 0.3 }
      }}
    >
      <Link href={`/blog/${slug}`} className="block">
        {/* Image */}
        <div className="relative h-40 overflow-hidden">
          {featuredImage ? (
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={featuredImage.fields.file.url}
              alt={title}
            />
          ) : (
            <GenerativePlaceholder title={title} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Date badge */}
          {publishedDate && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
              {publishedDate}
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/blog/${slug}`}>
          <h3 className="text-lg font-bold text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent-primary)] transition-colors mb-3">
            {title}
          </h3>
        </Link>

        <Link
          href={`/blog/${slug}`}
          className="inline-flex items-center text-[var(--accent-primary)] font-medium text-sm group-hover:gap-3 gap-2 transition-all"
        >
          Read Article
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

export default React.memo(BlogPostCard);
