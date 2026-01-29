import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GenerativePlaceholder from '../common/GenerativePlaceholder';

const BlogPostCard = ({ post }) => {
  const { title, slug, featuredImage } = post.fields;

  return (
    <motion.div
      className="bg-dark-2 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 shadow-primary/10"
    >
      <Link href={`/blog/${slug}`} className="block overflow-hidden relative h-48">
        {featuredImage ? (
          <img
            className="w-full h-40 object-cover object-center"
            src={featuredImage.fields.file.url}
            alt={title}
          />
        ) : (
          <GenerativePlaceholder title={title} />
        )}
      </Link>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300 mb-3 font-montserrat leading-tight">{title}</h3>
        <div className="mt-auto pt-4">
          <Link href={`/blog/${slug}`} className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors duration-300 group-hover:translate-x-2 transform transition-transform">
            Read Article
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(BlogPostCard);
