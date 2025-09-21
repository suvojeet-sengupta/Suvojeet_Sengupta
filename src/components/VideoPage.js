import React from 'react';
import { useParams } from 'react-router-dom';
import videos from '../data/videos.json';
import VideoPlayer from './VideoPlayer';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const VideoPage = () => {
  const { id } = useParams();
  const video = videos.find(v => v.id === id);

  if (!video) {
    return <div className="text-center text-white py-10">Video not found</div>;
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
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
        <title>{video.title} - Suvojeet Sengupta</title>
        <meta name="description" content={video.description} />
        <meta property="og:title" content={video.title} />
        <meta property="og:description" content={video.description} />
        <meta property="og:image" content={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:title" content={video.title} />
        <meta name="twitter:description" content={video.description} />
        <meta name="twitter:image" content={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <VideoPlayer videoId={video.id} />
        </div>
        <h1 className="text-3xl font-bold text-primary mb-4">{video.title}</h1>
        
        {video.description && (
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold text-primary mb-2">Description</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{video.description}</p>
          </div>
        )}

        <button
          onClick={handleShare}
          className="bg-primary text-dark font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition duration-300"
        >
          Share
        </button>
      </div>
    </motion.div>
  );
};

export default VideoPage;
