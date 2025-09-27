import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GenerativePlaceholder from './GenerativePlaceholder';

const BlogPostCard = ({ post }) => {
  const { title, slug, featuredImage } = post.fields;

  return (
    <motion.div
      className="bg-dark-2 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 shadow-primary/10"
    >
      <Link to={`/blog/${slug}`}>
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
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 font-montserrat">{title}</h3>
        <Link to={`/blog/${slug}`} className="text-primary hover:text-primary-dark transition-colors duration-300">
          Read More
        </Link>
      </div>
    </motion.div>
  );
};

export default React.memo(BlogPostCard);
