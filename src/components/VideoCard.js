import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <Link to={`/video/${video.id}`}>
      <motion.div
        key={video.id}
        className="bg-dark rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 shadow-primary/10 group"
        variants={itemVariants}
        whileHover={{ y: -10, transition: { duration: 0.2 } }}
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
    </Link>
  );
};

export default VideoCard;
