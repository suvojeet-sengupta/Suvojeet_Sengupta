export interface BlogSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  imageUrl: string | null;
  publishedAt: string;
  views: number;
  likes: number;
  author: string;
  tags: string[];
  commentsEnabled: boolean;
  commentsCount: number;
}

export interface BlogReply {
  id: number;
  commentId: number;
  name: string;
  content: string;
  isOwner: boolean;
  createdAt: string;
}

export interface BlogComment {
  id: number;
  blogId: number;
  name: string;
  email: string | null;
  content: string;
  isApproved: boolean;
  createdAt: string;
  replies: BlogReply[];
}

export interface BlogPost extends BlogSummary {
  content: string;
  updatedAt: string | null;
  comments: BlogComment[];
  hasLiked?: boolean;
}
