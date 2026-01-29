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
        className="glass-panel glass-panel-hover rounded-xl overflow-hidden transition-all duration-300 group"
        variants={itemVariants}
        whileHover={{ y: -10 }}
      >
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          <img
            src={`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`}
            alt={video.title}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
            <div className="bg-primary/90 p-4 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors duration-300 mb-2 font-montserrat line-clamp-2">{video.title}</h3>
          <p className="text-xs text-grey mt-2 font-medium">{new Date(video.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p className="text-sm text-gray-400 mt-3 line-clamp-3 leading-relaxed">
            {video.description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
};

export default React.memo(VideoCard);