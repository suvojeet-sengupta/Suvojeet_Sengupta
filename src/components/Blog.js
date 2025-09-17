import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogPosts from '../data/blog.json';
import { motion } from 'framer-motion';

const Blog = () => {
  useEffect(() => {
    document.title = "Blog | Suvojeet Sengupta";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Read the latest blog posts and updates from Suvojeet Sengupta. Get a behind-the-scenes look at his musical journey.";
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="bg-dark text-white pt-20">
      <motion.header
        className="py-20 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-center mb-12">Blog</h1>
        <p className="mt-4 text-base md:text-lg text-grey px-4">Behind-the-scenes stories, upcoming projects, and my thoughts on music.</p>
      </motion.header>

      <main className="w-full max-w-7xl mx-auto p-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {blogPosts.map((post) => (
            <motion.div
              key={post.id}
              className="bg-dark rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 shadow-primary/10"
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2 font-montserrat">{post.title}</h3>
                <p className="text-grey">{post.excerpt}</p>
                <p className="text-xs text-gray-400 mt-2">Published on: {new Date(post.publishedAt).toLocaleDateString()}</p>
                <Link to={`/blog/${post.slug}`} className="inline-block mt-4 px-4 py-2 font-bold text-dark bg-primary rounded-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 shadow-primary">
                  Read More
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default Blog;
