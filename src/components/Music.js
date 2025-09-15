import React, { useState } from 'react';
import videos from '../data/videos.json';
import { motion } from 'framer-motion';

const Music = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 7;

  // Calculate the videos for the current page
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);

  // Pagination controls
  const totalPages = Math.ceil(videos.length / videosPerPage);

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
      {/* Page Header */}
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
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {currentVideos.map((video) => (
            <motion.div
              key={video.id}
              className="bg-dark rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 shadow-primary/10"
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2 font-montserrat">{video.title}</h3>
                <p className="text-grey">{video.description}</p>
                <p className="text-xs text-gray-400 mt-2">Published on: {new Date(video.publishedAt).toLocaleDateString()}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-12">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="bg-primary text-dark font-bold py-2 px-4 rounded-l-lg hover:bg-opacity-80 transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="bg-gray-700 text-white font-bold py-2 px-4 rounded-md">
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
      </main>
    </div>
  );
};

export default Music;