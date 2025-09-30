import React from 'react';

/**
 * A component that displays an embedded YouTube video player.
 * @param {object} props - The component props.
 * @param {string} props.videoId - The ID of the YouTube video to play.
 */
const VideoPlayer = ({ videoId }) => {
  if (!videoId) {
    return null;
  }

  return (
    <div className="relative overflow-hidden w-full" style={{ paddingTop: '56.25%' }}>
      {/* This paddingTop creates a 16:9 aspect ratio container */}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
