
import React from 'react';

const VideoCard = ({ video, onPlay }) => {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer"
      onClick={() => onPlay(video.id)}
    >
      <div className="relative">
        <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt={video.title} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path>
          </svg>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2 truncate">{video.title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(video.publishedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default VideoCard;
