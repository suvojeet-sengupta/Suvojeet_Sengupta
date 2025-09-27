import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const RelatedVideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video.id}`} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200">
      <motion.div
        className="w-24 h-16 flex-shrink-0"
        whileHover={{ scale: 1.05 }}
      >
        <img
          src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
          alt={video.title}
          className="w-full h-full object-cover rounded-md"
        />
      </motion.div>
      <div className="overflow-hidden">
        <h4 className="text-sm font-semibold text-white leading-tight">{video.title}</h4>
        <p className="text-xs text-gray-400 mt-1">Suvojeet Sengupta</p>
      </div>
    </Link>
  );
};

export default React.memo(RelatedVideoCard);
