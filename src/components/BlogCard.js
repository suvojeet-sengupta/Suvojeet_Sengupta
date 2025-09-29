import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GenerativePlaceholder from './GenerativePlaceholder';
import Button from './Button';

/**
 * A card component to display a blog post summary.
 * @param {object} props - The component props.
 * @param {object} props.post - The blog post object from Contentful.
 * @param {string} props.post.fields.title - The title of the blog post.
 * @param {string} props.post.fields.excerpt - A short summary of the blog post.
 * @param {string} props.post.fields.slug - The URL slug for the blog post.
 * @param {object} props.post.fields.featuredImage - The featured image for the blog post.
 * @param {string[]} props.post.fields.tags - An array of tags for the blog post.
 * @param {string} props.post.fields.publishedAt - The publication date of the blog post.
 */
const BlogCard = ({ post }) => {
  const { title, excerpt, slug, featuredImage, tags, publishedAt } = post.fields;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div
      className="bg-dark-2 rounded-lg shadow-lg overflow-hidden shadow-primary/10"
      variants={itemVariants}
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(249, 168, 40, 0.2)" }}
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
          <Button to={`/blog/${slug}`} primary={false} className="py-2 px-4 text-sm">
            Read More
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(BlogCard);
