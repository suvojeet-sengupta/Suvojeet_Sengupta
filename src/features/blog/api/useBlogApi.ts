import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { BlogSummary, BlogPost } from '@/types/blog';

export function useBlogPosts() {
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const response = await fetch('/api/public/posts');
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      const data = await response.json();
      return data.posts as BlogSummary[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useLikePost(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/public/posts/${slug}/like`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to like post');
      return response.json();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
}
