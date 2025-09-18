import React from 'react';

/**
 * A component that displays a YouTube video player in a modal.
 * @param {object} props - The component props.
 * @param {string} props.videoId - The ID of the YouTube video to play.
 * @param {Function} props.onClose - The function to call to close the player.
 */
const VideoPlayer = ({ videoId, onClose }) => {
  if (!videoId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="relative bg-dark overflow-hidden w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="aspect-square">
          <iframe 
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
        <button onClick={onClose} className="absolute top-2 right-2 text-white bg-primary rounded-full p-2 hover:bg-opacity-80 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;