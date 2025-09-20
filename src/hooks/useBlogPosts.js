import { useState, useEffect } from 'react';
import client from '../contentful';

const useBlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await client.getEntries({ content_type: 'blogPost' });
        setPosts(response.items);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
};

export default useBlogPosts;