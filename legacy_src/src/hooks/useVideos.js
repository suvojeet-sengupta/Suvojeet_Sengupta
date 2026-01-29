import { useState, useEffect } from 'react';
import videos from '../data/videos.json';

const getCategory = (title) => {
  const lowerCaseTitle = title.toLowerCase();
  if (lowerCaseTitle.includes('rabindra sangeet')) {
    return 'Rabindra Sangeet';
  }
  if (lowerCaseTitle.includes('live') || lowerCaseTitle.includes('performance') || lowerCaseTitle.includes('program')) {
    return 'Live Performance';
  }
  if (lowerCaseTitle.includes('retro') || lowerCaseTitle.includes('lag jaa gale')) {
    return 'Retro';
  }
  if (lowerCaseTitle.includes('arijit') || lowerCaseTitle.includes('vida karo')) {
    return 'Arijit Singh';
  }
  if (lowerCaseTitle.includes('bhajan') || lowerCaseTitle.includes('bhakti') || lowerCaseTitle.includes('devotional') || lowerCaseTitle.includes('satyam shivam sundaram')) {
    return 'Bhajan';
  }
  return 'Cover';
};

const useVideos = () => {
  const [videoData, setVideoData] = useState({ videos: [], playlists: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const categorizedVideos = videos.map(video => ({
        ...video,
        category: video.category || getCategory(video.title),
      }));

      const playlists = {
        'Music Videos': categorizedVideos.filter(video => video.playlist === 'Music Videos'),
        'Live Performances': categorizedVideos.filter(video => video.playlist === 'Live Performances'),
        'Covers': categorizedVideos.filter(video => video.playlist === 'Covers'),
      };
      setVideoData({ videos: categorizedVideos, playlists });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { ...videoData, loading, error };
};

export default useVideos;