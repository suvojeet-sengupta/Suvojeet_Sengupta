import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-dark-2 rounded-lg overflow-hidden shadow-lg animate-pulse">
      <div className="h-48 bg-gray-700"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        <div className="mt-6 h-10 bg-gray-700 rounded w-1/3"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;