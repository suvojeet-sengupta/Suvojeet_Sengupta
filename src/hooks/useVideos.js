import { useState, useEffect } from 'react';
import videos from '../data/videos.json';

const useVideos = () => {
  const [videoData, setVideoData] = useState({ videos: [], playlists: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const playlists = {
        'Music Videos': videos.filter(video => video.playlist === 'Music Videos'),
        'Live Performances': videos.filter(video => video.playlist === 'Live Performances'),
        'Covers': videos.filter(video => video.playlist === 'Covers'),
      };
      setVideoData({ videos, playlists });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { ...videoData, loading, error };
};

export default useVideos;