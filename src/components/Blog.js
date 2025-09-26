import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BlogCard from './BlogCard';
import useBlogPosts from '../hooks/useBlogPosts';
import SkeletonCard from './SkeletonCard';
import { Helmet } from 'react-helmet-async';

const POSTS_PER_PAGE = 6;

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever a new search is performed
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const { posts, total, loading, error } = useBlogPosts({
    limit: POSTS_PER_PAGE,
    skip: (currentPage - 1) * POSTS_PER_PAGE,
    query: searchQuery,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(POSTS_PER_PAGE)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Error loading blog posts</h2>
          <p className="text-grey mt-4">Please try again later.</p>
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold">No Posts Found</h2>
          <p className="text-grey mt-4">Try adjusting your search query or check back later.</p>
        </div>
      );
    }

    return (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {posts.map((post) => (
          <BlogCard key={post.sys.id} post={post} />
        ))}
      </motion.div>
    );
  };

  return (
    <div className="bg-dark text-white pt-20">
      <Helmet>
        <title>Blog | Suvojeet Sengupta</title>
        <meta name="description" content="Read the latest blog posts and updates from Suvojeet Sengupta. Get a behind-the-scenes look at his musical journey." />
      </Helmet>

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
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
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
        {renderContent()}
        {total > POSTS_PER_PAGE && (
          <div className="flex justify-center items-center mt-16 space-x-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md bg-primary text-white disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-lg">Page {currentPage} of {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-md bg-primary text-white disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Blog;
