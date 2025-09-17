import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import blogPosts from '../data/blog.json';
import { motion } from 'framer-motion';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const currentPost = blogPosts.find((post) => post.slug === slug);
    setPost(currentPost);

    if (currentPost) {
      document.title = `${currentPost.title} | Suvojeet Sengupta`;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = currentPost.excerpt;
    }
  }, [slug]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-dark text-white pt-20">
      <motion.header
        className="py-20 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-center mb-4">{post.title}</h1>
        <p className="text-xs text-gray-400 mt-2">Published on: {new Date(post.publishedAt).toLocaleDateString()} by {post.author}</p>
      </motion.header>

      <main className="w-full max-w-4xl mx-auto p-8">
        <motion.div
          className="bg-dark rounded-lg shadow-xl p-8 md:p-12 mb-16 shadow-primary/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="prose prose-invert max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default BlogPost;
