import { useState, useEffect } from 'react';
import client from '../contentful';

const useBlogPosts = ({ bypassCache = false } = {}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!bypassCache) {
          const cachedPosts = localStorage.getItem('blogPosts');
          if (cachedPosts) {
            const { posts, timestamp } = JSON.parse(cachedPosts);
            const isCacheStale = (Date.now() - timestamp) > 3600000; // 1 hour
            if (!isCacheStale) {
              setPosts(posts);
              setLoading(false);
              return;
            }
          }
        }

        const response = await client.getEntries({ content_type: 'blogPost' });
        const newPosts = response.items;
        setPosts(newPosts);
        localStorage.setItem('blogPosts', JSON.stringify({ posts: newPosts, timestamp: Date.now() }));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [bypassCache]);

  return { posts, loading, error };
};

export default useBlogPosts;