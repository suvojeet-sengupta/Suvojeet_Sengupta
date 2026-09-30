import React from 'react';
import LiveIndicator from './LiveIndicator';

interface GlobalVisitorCountProps {
  count: number;
}

const GlobalVisitorCount: React.FC<GlobalVisitorCountProps> = ({ count }) => {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-6 left-5 z-40 md:bottom-8 md:left-8">
      <LiveIndicator count={count} text={count === 1 ? 'visitor online' : 'visitors online'} />
    </div>
  );
};

export default GlobalVisitorCount;
