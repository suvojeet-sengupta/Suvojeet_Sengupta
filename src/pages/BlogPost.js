import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import useBlogPosts from '../hooks/useBlogPosts';
import { socket } from '../services/socket';
import EmojiReactionButton from '../components/common/EmojiReactionButton';
import FloatingEmoji from '../components/common/FloatingEmoji';
import LiveIndicator from '../components/common/LiveIndicator';
import { Helmet } from 'react-helmet-async';

/**
 * The BlogPost page component.
 * Displays a single blog post with real-time features like viewer count and emoji reactions.
 */
const BlogPost = () => {
  const { slug } = useParams();
  const { posts } = useBlogPosts();
  const [post, setPost] = useState(null);
  const [showCopied, setShowCopied] = useState(false);
  const room = `blog-${slug}`;

  // Real-time state for viewer count and reactions.
  const [viewerCount, setViewerCount] = useState(0);
  const [reactions, setReactions] = useState([]);

  // Effect to find the current post from the list of all posts.
  useEffect(() => {
    if (posts.length > 0) {
      const currentPost = posts.find((p) => p.fields.slug === slug);
      setPost(currentPost);

      if (currentPost) {
        setPost(currentPost);
      }
    }
  }, [slug, posts]);

  // Effect to handle real-time socket events for the current blog post.
  useEffect(() => {
    // Join a room specific to this blog post to receive real-time updates.
    socket.emit('join_room', { room });

    // Listen for viewer count updates.
    socket.on('update_viewer_count', (data) => {
      setViewerCount(data.count);
    });

    // Listen for new emoji reactions.
    socket.on('new_reaction', (data) => {
      const newReaction = {
        id: Date.now() + Math.random(),
        emoji: data.emoji,
      };
      setReactions(prev => [...prev, newReaction]);
    });

    // Clean up socket listeners on component unmount.
    return () => {
      socket.emit('leave_room', { room });
      socket.off('update_viewer_count');
      socket.off('new_reaction');
    };
  }, [room]);

  /**
   * Removes a reaction from the state after its animation is complete.
   * @param {number} reactionId - The ID of the reaction to remove.
   */
  const handleAnimationComplete = (reactionId) => {
    setReactions(prev => prev.filter(r => r.id !== reactionId));
  };

  /**
   * Handles the share functionality.
   * Uses the Web Share API if available, otherwise copies the URL to the clipboard.
   */
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: post.fields.title,
        text: post.fields.excerpt,
        url: url,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(url);
      setShowCopied(true);
      setTimeout(() => {
        setShowCopied(false);
      }, 2000);
    }
  };

  // Display a loading message while the post is being fetched.
  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-dark text-white relative">
      <Helmet>
        <title>{`${post.fields.title} | Suvojeet Sengupta`}</title>
        <meta name="description" content={post.fields.excerpt} />
        <meta property="og:title" content={post.fields.title} />
        <meta property="og:description" content={post.fields.excerpt} />
        {post.fields.coverImage?.fields?.file?.url && (
          <meta property="og:image" content={`https:${post.fields.coverImage.fields.file.url}`} />
        )}
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.fields.title} />
        <meta name="twitter:description" content={post.fields.excerpt} />
        {post.fields.coverImage?.fields?.file?.url && (
          <meta name="twitter:image" content={`https:${post.fields.coverImage.fields.file.url}`} />
        )}
        <script type="application/ld+json">
          {
            JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": window.location.href
              },
              "headline": post.fields.title,
              "description": post.fields.excerpt,
              "image": post.fields.coverImage?.fields?.file?.url ? `https:${post.fields.coverImage.fields.file.url}` : '',
              "author": {
                "@type": "Person",
                "name": post.fields.author
              },
              "publisher": {
                "@type": "Organization",
                "name": "Suvojeet Sengupta",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.suvojeetsengupta.in/logo.svg"
                }
              },
              "datePublished": post.fields.publishedAt,
              "dateModified": post.sys.updatedAt
            })
          }
        </script>
      </Helmet>
      {/* Floating Emojis Container */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50">
        {reactions.map(reaction => (
          <FloatingEmoji 
            key={reaction.id} 
            emoji={reaction.emoji} 
            onAnimationComplete={() => handleAnimationComplete(reaction.id)}
          />
        ))}
      </div>

      <motion.header
        className="py-12 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-center mb-4">{post.fields.title}</h1>
        <div className="flex justify-center items-center space-x-4 text-xs text-gray-400 mt-2">
          <span>Published on: {new Date(post.fields.publishedAt).toLocaleDateString()} by {post.fields.author}</span>
          <LiveIndicator count={viewerCount} text={viewerCount === 1 ? 'reader online' : 'readers online'} />
        </div>
      </motion.header>

      <main className="w-full max-w-4xl mx-auto">
        <motion.div
          className="bg-dark rounded-lg shadow-xl px-6 py-8 sm:p-12 mb-16 shadow-primary/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="prose prose-invert max-w-none">
            {documentToReactComponents(post.fields.content)}
          </div>
          <div className="mt-8 flex justify-end items-center space-x-4">
            <EmojiReactionButton room={room} />
            <button
              onClick={handleShare}
              className="flex items-center px-4 py-2 font-bold text-dark bg-primary rounded-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 shadow-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              Share
            </button>
          </div>
        </motion.div>
      </main>
      {showCopied && (
        <div className="fixed bottom-10 right-10 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default BlogPost;
