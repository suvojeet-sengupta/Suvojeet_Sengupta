import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import LiveIndicator from './LiveIndicator';

const GlobalVisitorCount = () => {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    socket.on('update_visitor_count', (data) => {
      setVisitorCount(data.count);
    });

    return () => {
      socket.off('update_visitor_count');
    };
  }, []);

  if (visitorCount === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 hidden md:block">
      <LiveIndicator count={visitorCount} text={visitorCount === 1 ? 'visitor online' : 'visitors online'} />
    </div>
  );
};

export default GlobalVisitorCount;
