import React, { useState, useEffect } from 'react';
import client from '../contentful';
import { motion } from 'framer-motion';
import BlogCard from './BlogCard';

/**
 * The Blog page component.
 * This component fetches and displays blog posts from Contentful.
 * It includes:
 * - A search bar to filter posts.
 * - A featured post section.
 * - A grid of other blog posts.
 */
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
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search for articles, topics, or keywords..."
              className="w-full pl-10 pr-4 py-3 rounded-full bg-white bg-opacity-10 text-white placeholder-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:bg-opacity-20 backdrop-blur-sm transition-all duration-300 ease-in-out shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
