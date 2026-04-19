import { z } from 'zod';

export const commentSchema = z.object({
  author: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  content: z.string().min(1, "Comment cannot be empty").max(1000),
  postSlug: z.string(),
  parentId: z.string().optional(),
});

export type CommentInput = z.infer<typeof commentSchema>;
