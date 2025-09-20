import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-dark-2 rounded-lg shadow-lg overflow-hidden">
      <div className="w-full h-56 bg-gray-700 animate-pulse"></div>
      <div className="p-6">
        <div className="h-4 bg-gray-700 rounded w-1/4 mb-2 animate-pulse"></div>
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6 mb-4 animate-pulse"></div>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-700 rounded w-1/4 animate-pulse"></div>
          <div className="h-10 bg-primary rounded-lg w-1/3 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;