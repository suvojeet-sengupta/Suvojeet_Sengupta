import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GenerativePlaceholder from './GenerativePlaceholder';

const BlogCard = ({ post }) => {
  const { title, excerpt, slug, featuredImage, tags, publishedAt } = post.fields;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div
      className="bg-dark-2 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 shadow-primary/10"
      variants={itemVariants}
    >
      <Link to={`/blog/${slug}`}>
        {featuredImage ? (
          <img
            className="w-full h-56 object-cover object-center"
            src={featuredImage.fields.file.url}
            alt={title}
          />
        ) : (
          <GenerativePlaceholder title={title} />
        )}
      </Link>
      <div className="p-6">
        <div className="flex items-center mb-2">
          {tags && tags.map(tag => (
            <span key={tag} className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10 mr-2">{tag}</span>
          ))}
        </div>
        <h3 className="text-xl font-bold text-white mb-2 font-montserrat">{title}</h3>
        <p className="text-grey-2 leading-relaxed mb-4">{excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">{new Date(publishedAt).toLocaleDateString()}</span>
          <Link to={`/blog/${slug}`} className="inline-block px-4 py-2 font-bold text-dark bg-primary rounded-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 shadow-primary">
            Read More
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
