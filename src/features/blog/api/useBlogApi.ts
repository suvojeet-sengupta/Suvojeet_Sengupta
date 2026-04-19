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
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['post', slug] });
      const previousPost = queryClient.getQueryData<BlogPost>(['post', slug]);

      if (previousPost) {
        queryClient.setQueryData(['post', slug], {
          ...previousPost,
          hasLiked: !previousPost.hasLiked,
          likes: previousPost.hasLiked ? previousPost.likes - 1 : previousPost.likes + 1,
        });
      }

      return { previousPost };
    },
    onError: (err, variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(['post', slug], context.previousPost);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post', slug] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
}
