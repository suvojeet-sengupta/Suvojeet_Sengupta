import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import videos from '../data/videos.json';
import VideoPlayer from './VideoPlayer';
import Comments from './Comments';
import RelatedVideoCard from './RelatedVideoCard';
import Toast from './Toast'; // Import the Toast component
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const VideoPage = () => {
  const { id } = useParams();
  const video = videos.find(v => v.id === id);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (video) {
      const related = videos
        .filter(v => v.id !== video.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
      setRelatedVideos(related);
    }
  }, [id, video]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

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
      navigator.clipboard.writeText(window.location.href);
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
      </Helmet>
      
      <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Left Column: Video Player and Details */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <VideoPlayer videoId={video.id} />
          </div>
          
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-primary mb-4">{video.title}</h1>
            <button
              onClick={handleShare}
              className="bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300 mt-1 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path></svg>
              <span>Share</span>
            </button>
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
