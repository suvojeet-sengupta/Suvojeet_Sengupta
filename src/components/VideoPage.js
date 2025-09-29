import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import videos from '../data/videos.json';
import VideoPlayer from './VideoPlayer';
import Comments from './Comments';
import RelatedVideoCard from './RelatedVideoCard';
import Toast from './Toast';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { socket } from '../socket'; // Import the socket instance
import EmojiReactionButton from './EmojiReactionButton'; // Import the reaction button
import FloatingEmoji from './FloatingEmoji'; // Import the floating emoji component
import LiveIndicator from './LiveIndicator';

const VideoPage = () => {
  const { id } = useParams();
  const video = videos.find(v => v.id === id);
  const room = `video-${id}`;

  const [relatedVideos, setRelatedVideos] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Real-time state
  const [viewerCount, setViewerCount] = useState(0);
  const [reactions, setReactions] = useState([]);

  useEffect(() => {
    if (video) {
      const related = videos
        .filter(v => v.id !== video.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
      setRelatedVideos(related);
    }

    // Join the video-specific room on mount
    socket.emit('join_room', { room });

    // Listen for viewer count updates
    socket.on('update_viewer_count', (data) => {
      setViewerCount(data.count);
    });

    // Listen for new emoji reactions
    socket.on('new_reaction', (data) => {
      const newReaction = {
        id: Date.now() + Math.random(), // Unique key for the component
        emoji: data.emoji,
      };
      setReactions(prev => [...prev, newReaction]);
    });

    // Clean up on unmount
    return () => {
      socket.emit('leave_room', { room });
      socket.off('update_viewer_count');
      socket.off('new_reaction');
    };
  }, [id, video, room]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);



  const handleAnimationComplete = (reactionId) => {
    setReactions(prev => prev.filter(r => r.id !== reactionId));
  };

  if (!video) {
    return <div className="text-center text-white py-10">Video not found</div>;
  }

  const handleShare = () => {
    const url = `${window.location.href}?v=${Date.now()}`;
    if (navigator.share) {
      navigator.share({
        title: video.title,
        url: url,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(url);
      setToastMessage('Link Copied!');
      setShowToast(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 pt-24 pb-8 text-white"
    >
      <Helmet>
        <title>{`${video.title} - Suvojeet Sengupta`}</title>
        <meta name="description" content={video.description} />
        <meta property="og:title" content={`${video.title} - Suvojeet Sengupta`} />
        <meta property="og:description" content={video.description} />
        <meta property="og:image" content={`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${video.title} - Suvojeet Sengupta`} />
        <meta name="twitter:description" content={video.description} />
        <meta name="twitter:image" content={`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`} />
        <script type="application/ld+json">
          {
            JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "name": video.title,
              "description": video.description,
              "thumbnailUrl": `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`,
              "uploadDate": video.publishedAt,
              "publisher": {
                "@type": "Organization",
                "name": "Suvojeet Sengupta",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.suvojeetsengupta.in/logo.svg"
                }
              },
              "contentUrl": `https://www.youtube.com/watch?v=${video.id}`,
              "embedUrl": `https://www.youtube.com/embed/${video.id}`
            })
          }
        </script>
      </Helmet>
      
      <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Left Column: Video Player and Details */}
        <div className="lg:col-span-2 relative">
          {/* Floating Emojis Container */}
          <div className="absolute bottom-20 left-0 w-full h-64 pointer-events-none z-50">
            {reactions.map(reaction => (
              <FloatingEmoji 
                key={reaction.id} 
                emoji={reaction.emoji} 
                onAnimationComplete={() => handleAnimationComplete(reaction.id)}
              />
            ))}
          </div>

          <div className="mb-6">
            <VideoPlayer videoId={video.id} />
          </div>
          
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <h1 className="text-3xl font-bold text-primary mb-3 sm:mb-0">{video.title}</h1>
              <div className="mt-2 sm:mt-0">
                <LiveIndicator count={viewerCount} text={viewerCount === 1 ? 'person watching' : 'people watching'} />
              </div>
            </div>
            <div className="flex items-center justify-end mt-4">
                {/* Right-aligned buttons */}
                <div className="flex items-center space-x-4">
                    <EmojiReactionButton room={room} />
                    <a
                        href={`https://www.youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 flex items-center space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        <span>YouTube</span>
                    </a>
                    <button
                        onClick={handleShare}
                        className="bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300 flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path></svg>
                        <span>Share</span>
                    </button>
                </div>
            </div>
          </div>

          {video.description && (
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-semibold text-primary mb-2">Description</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{video.description}</p>
            </div>
          )}

          <Comments comments={video.comments} />
        </div>

        {/* Right Column: Related Videos */}
        <div className="lg:col-span-1 mt-8 lg:mt-0">
          <h2 className="text-2xl font-bold text-primary mb-4">Up Next</h2>
          <div className="space-y-4">
            {relatedVideos.map(relatedVideo => (
              <RelatedVideoCard key={relatedVideo.id} video={relatedVideo} />
            ))}
          </div>
        </div>
      </div>
      <Toast message={toastMessage} show={showToast} />
    </motion.div>
  );
};

export default VideoPage;
