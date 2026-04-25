'use client';

import { useState, useEffect } from 'react';
import { socket } from '@/services/socket';

export const useVisitorCount = () => {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    // Listen for visitor count updates from the server
    socket.on('visitor_count', (count: number) => {
      setVisitorCount(count);
    });

    // Request initial count or join the visitor pool
    socket.emit('get_visitor_count');

    return () => {
      socket.off('visitor_count');
    };
  }, []);

  return visitorCount;
};
