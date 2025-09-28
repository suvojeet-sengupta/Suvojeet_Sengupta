import React from 'react';
import LiveIndicator from './LiveIndicator';

const GlobalVisitorCount = ({ count }) => {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 hidden md:block">
      <LiveIndicator count={count} text={count === 1 ? 'visitor online' : 'visitors online'} />
    </div>
  );
};

export default GlobalVisitorCount;
