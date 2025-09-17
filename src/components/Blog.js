import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../contentful';
import { motion } from 'framer-motion';
import BlogCard from './BlogCard';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    document.title = "Blog | Suvojeet Sengupta";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Read the latest blog posts and updates from Suvojeet Sengupta. Get a behind-the-scenes look at his musical journey.";

    client.getEntries({ content_type: 'blogPost' })
      .then((response) => {
        setPosts(response.items);
        setFilteredPosts(response.items);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const filtered = posts.filter(post =>
      post.fields.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const otherPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

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
        <div className="mt-8 w-full max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search posts..."
            className="w-full px-4 py-2 rounded-lg bg-dark-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.header>

      <main className="w-full max-w-7xl mx-auto p-8">
        {featuredPost && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">Featured Post</h2>
            <BlogCard post={featuredPost} />
          </motion.div>
        )}

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {otherPosts.map((post) => (
            <BlogCard key={post.sys.id} post={post} />
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default Blog;
