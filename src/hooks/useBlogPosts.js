import { useState, useEffect } from 'react';
import client from '../services/contentful';

const useBlogPosts = ({ limit, skip, query, bypassCache = false } = {}) => {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const isPaginated = limit !== undefined;
        const isSearching = query && query.length > 0;

        // Bypass cache if paginating, searching, or explicitly told to
        if (!isPaginated && !isSearching && !bypassCache) {
          const cachedPosts = localStorage.getItem('blogPosts');
          if (cachedPosts) {
            const { posts, timestamp } = JSON.parse(cachedPosts);
            const isCacheStale = (Date.now() - timestamp) > 3600000; // 1 hour
            if (!isCacheStale) {
              setPosts(posts);
              setTotal(posts.length);
              setLoading(false);
              return;
            }
          }
        }

        const params = {
          content_type: 'blogPost',
          order: '-sys.createdAt', // Always order by creation date
        };
        if (limit) params.limit = limit;
        if (skip) params.skip = skip;
        if (isSearching) params.query = query;

        const response = await client.getEntries(params);
        
        const newPosts = response.items;
        setPosts(newPosts);
        setTotal(response.total);

        // Only cache if not paginating and not searching
        if (!isPaginated && !isSearching) {
          localStorage.setItem('blogPosts', JSON.stringify({ posts: newPosts, timestamp: Date.now() }));
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [limit, skip, query, bypassCache]);

  return { posts, total, loading, error };
};

export default useBlogPosts;