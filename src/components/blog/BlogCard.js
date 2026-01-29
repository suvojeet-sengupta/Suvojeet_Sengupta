import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GenerativePlaceholder from '../common/GenerativePlaceholder';

const BlogCard = ({ post }) => {
  const { title, excerpt, slug, featuredImage, tags, publishedAt } = post.fields;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const publishedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <motion.div
      className="card-elevated rounded-2xl overflow-hidden group"
      variants={itemVariants}
      whileHover={{
        y: -8,
        boxShadow: "0 20px 40px rgba(99, 102, 241, 0.15)",
        transition: { duration: 0.3 }
      }}
    >
      <Link href={`/blog/${slug}`} className="block">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          {featuredImage ? (
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={featuredImage.fields.file.url}
              alt={title}
            />
          ) : (
            <GenerativePlaceholder title={title} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      </Link>

      <div className="p-6">
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={`/blog/${slug}`}>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 line-clamp-2 group-hover:text-[var(--accent-primary)] transition-colors">
            {title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4 line-clamp-2">
          {excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
          <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
            {publishedDate}
          </span>
          <Link
            href={`/blog/${slug}`}
            className="flex items-center gap-2 text-[var(--accent-primary)] font-medium text-sm group-hover:gap-3 transition-all"
          >
            <span>Read More</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(BlogCard);
