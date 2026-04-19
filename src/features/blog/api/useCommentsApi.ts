import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { BlogComment } from '@/types/blog';
import { CommentInput } from '../schemas';

const COMMENTS_QUERY_KEY = 'comments';

export function useCommentsApi(slug: string, initialData?: { comments: BlogComment[], count: number }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [COMMENTS_QUERY_KEY, slug],
    queryFn: async () => {
      const response = await fetch(`/api/public/posts/${slug}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      return response.json() as Promise<{ comments: BlogComment[], count: number }>;
    },
    initialData,
    enabled: !!slug,
  });

  const commentMutation = useMutation({
    mutationFn: async (newComment: CommentInput) => {
      const response = await fetch(`/api/public/posts/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to post comment');
      }
      return response.json();
    },
    // Optimistic UI implementation
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: [COMMENTS_QUERY_KEY, slug] });
      const previousData = queryClient.getQueryData([COMMENTS_QUERY_KEY, slug]);

      if (previousData) {
        queryClient.setQueryData([COMMENTS_QUERY_KEY, slug], (old: any) => ({
          ...old,
          comments: [
            {
              id: Date.now(), // Temporary ID
              author: newComment.author,
              content: newComment.content,
              createdAt: new Date().toISOString(),
              isPending: true, // Custom flag for UI
              replies: [],
            },
            ...old.comments,
          ],
          count: old.count + 1,
        }));
      }

      return { previousData };
    },
    onError: (err, newComment, context) => {
      if (context?.previousData) {
        queryClient.setQueryData([COMMENTS_QUERY_KEY, slug], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [COMMENTS_QUERY_KEY, slug] });
    },
  });

  return {
    comments: data?.comments ?? [],
    count: data?.count ?? 0,
    isLoading,
    postComment: commentMutation.mutateAsync,
    isPosting: commentMutation.isPending,
    error: commentMutation.error,
  };
}
