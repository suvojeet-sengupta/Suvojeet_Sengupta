import React, { useState, useEffect } from 'react';
import videos from '../data/videos.json';
import { motion } from 'framer-motion';
import VideoPlayer from './VideoPlayer'; // Assuming VideoPlayer component is in the same directory

/**
 * The Music page component.
 * This component displays a collection of music videos from a local JSON file.
 * It includes:
 * - A featured video section for the latest video.
 * - A paginated grid of other videos.
 * - A video player that opens in a modal.
 */
const Music = () => {
  const [playingVideoId, setPlayingVideoId] = useState(null);

  useEffect(() => {
    document.title = "Music | Suvojeet Sengupta";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Listen to the latest songs and covers by Suvojeet Sengupta. Explore a collection of his performances and musical works.";
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 6;

  const sortedVideos = [...videos].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  const latestVideo = sortedVideos[0];
  const otherVideos = sortedVideos.slice(1);

  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = otherVideos.slice(indexOfFirstVideo, indexOfLastVideo);

  const totalPages = Math.ceil(otherVideos.length / videosPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handlePlayVideo = (videoId) => {
    setPlayingVideoId(videoId);
  };

  const handleClosePlayer = () => {
    setPlayingVideoId(null);
  };

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
        <h1 className="text-4xl font-bold text-center mb-12">My Music</h1>
        <p className="mt-4 text-base md:text-lg text-grey px-4">Explore the melodies and stories behind the songs.</p>
      </motion.header>

      <main className="w-full max-w-7xl mx-auto p-8">
        {latestVideo && (
          <motion.div 
            className="mb-12 rounded-lg shadow-xl overflow-hidden bg-dark"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div 
                className="relative cursor-pointer group"
                onClick={() => handlePlayVideo(latestVideo.id)}
              >
                <img 
                  src={`https://i.ytimg.com/vi/${latestVideo.id}/maxresdefault.jpg`} 
                  alt={latestVideo.title} 
                  className="w-full rounded-l-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path>
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-3xl font-bold mb-2 text-primary">{latestVideo.title}</h3>
                <p className="text-grey mb-4">
                  {new Date(latestVideo.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-base">{latestVideo.description || 'No description available.'}</p>
                 <button 
                  onClick={() => handlePlayVideo(latestVideo.id)}
                  className="mt-6 px-8 py-3 bg-primary text-dark font-bold rounded-lg hover:bg-opacity-80 transition duration-300"
                >
                  Watch Now
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {currentVideos.map((video) => (
            <motion.div
              key={video.id}
              className="bg-dark rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 shadow-primary/10 cursor-pointer group"
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              onClick={() => handlePlayVideo(video.id)}
            >
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                 <img 
                  src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} 
                  alt={video.title} 
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path>
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2 font-montserrat truncate">{video.title}</h3>
                <p className="text-xs text-gray-400 mt-2">{new Date(video.publishedAt).toLocaleDateString()}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="bg-primary text-dark font-bold py-2 px-4 rounded-l-lg hover:bg-opacity-80 transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="bg-gray-700 text-white font-bold py-2 px-4">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="bg-primary text-dark font-bold py-2 px-4 rounded-r-lg hover:bg-opacity-80 transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </main>
      <VideoPlayer videoId={playingVideoId} onClose={handleClosePlayer} />
    </div>
  );
};

export default Music;
