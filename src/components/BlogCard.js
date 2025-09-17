import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
          <div className="w-full h-56 bg-dark-3 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
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
