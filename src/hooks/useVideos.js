import { useState, useEffect } from 'react';
import videos from '../data/videos.json';

const useVideos = () => {
  const [videoData, setVideoData] = useState({ videos: [], playlists: [] });

  useEffect(() => {
    const playlists = {
      'Music Videos': videos.filter(video => video.playlist === 'Music Videos'),
      'Live Performances': videos.filter(video => video.playlist === 'Live Performances'),
      'Covers': videos.filter(video => video.playlist === 'Covers'),
    };
    setVideoData({ videos, playlists });
  }, []);

  return videoData;
};

export default useVideos;