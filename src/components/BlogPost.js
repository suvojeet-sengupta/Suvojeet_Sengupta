import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import useBlogPosts from '../hooks/useBlogPosts';
import { socket } from '../socket';
import EmojiReactionButton from './EmojiReactionButton';
import FloatingEmoji from './FloatingEmoji';
import LiveIndicator from './LiveIndicator';

const BlogPost = () => {
  const { slug } = useParams();
  const { posts } = useBlogPosts();
  const [post, setPost] = useState(null);
  const [showCopied, setShowCopied] = useState(false);
  const room = `blog-${slug}`;

  // Real-time state
  const [viewerCount, setViewerCount] = useState(0);
  const [reactions, setReactions] = useState([]);

  useEffect(() => {
    if (posts.length > 0) {
      const currentPost = posts.find((p) => p.fields.slug === slug);
      setPost(currentPost);

      if (currentPost) {
        document.title = `${currentPost.fields.title} | Suvojeet Sengupta`;
        // SEO and meta tag updates...
      }
    }
  }, [slug, posts]);

  useEffect(() => {
    // Join the blog-specific room on mount
    socket.emit('join_room', { room });

    socket.on('update_viewer_count', (data) => {
      setViewerCount(data.count);
    });

    socket.on('new_reaction', (data) => {
      const newReaction = {
        id: Date.now() + Math.random(),
        emoji: data.emoji,
      };
      setReactions(prev => [...prev, newReaction]);
    });

    return () => {
      socket.emit('leave_room', { room });
      socket.off('update_viewer_count');
      socket.off('new_reaction');
    };
  }, [room]);

  const handleAnimationComplete = (reactionId) => {
    setReactions(prev => prev.filter(r => r.id !== reactionId));
  };

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

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-dark text-white pt-20 relative">
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
        className="py-20 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-center mb-4">{post.fields.title}</h1>
        <div className="flex justify-center items-center space-x-4 text-xs text-gray-400 mt-2">
          <span>Published on: {new Date(post.fields.publishedAt).toLocaleDateString()} by {post.fields.author}</span>
          <LiveIndicator count={viewerCount} text={viewerCount === 1 ? 'reader online' : 'readers online'} />
        </div>
      </motion.header>

      <main className="w-full max-w-4xl mx-auto p-8">
        <motion.div
          className="bg-dark rounded-lg shadow-xl p-8 md:p-12 mb-16 shadow-primary/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="prose prose-invert max-w-none">
            {documentToReactComponents(post.fields.content, {
              renderNode: {
                [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-4">{children}</p>,
              },
            })}
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
