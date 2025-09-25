import React from 'react';

const LiveIndicator = ({ count, text }) => {
  return (
    <div className="flex items-center bg-gray-800 bg-opacity-50 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
      <span className="relative flex h-2 w-2 mr-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
      </span>
      {count} {text}
    </div>
  );
};

export default LiveIndicator;
