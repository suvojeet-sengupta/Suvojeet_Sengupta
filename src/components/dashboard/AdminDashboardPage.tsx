'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { BlogReply, BlogSummary } from '@/types/blog';

interface DashboardStats {
  totalPosts: number;
  totalComments: number;
  pendingComments: number;
  totalReplies: number;
  totalBlogViews: number;
  totalPageViews: number;
}

interface AdminComment {
  id: number;
  blogId: number;
  blogTitle: string;
  name: string;
  email: string | null;
  content: string;
  isApproved: boolean;
  createdAt: string;
  replies: BlogReply[];
}

interface DashboardOverview {
  stats: DashboardStats;
  posts: BlogSummary[];
  comments: AdminComment[];
}

interface PostFormState {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  tags: string;
  content: string;
  commentsEnabled: boolean;
}

const initialPostForm: PostFormState = {
  title: '',
  slug: '',
  excerpt: '',
  category: '',
  imageUrl: '',
  tags: '',
  content: '',
  commentsEnabled: true,
};

function formatDate(value: string): string {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState('');
  const [postForm, setPostForm] = useState<PostFormState>(initialPostForm);
  const [creatingPost, setCreatingPost] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(null);

  const loadOverview = useCallback(async () => {
    setError('');
    try {
      const response = await fetch('/api/admin/overview', { cache: 'no-store' });
      const payload = await response.json() as DashboardOverview & { error?: string };

      if (response.status === 401) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setError(payload.error || 'Unable to load dashboard data.');
        setLoading(false);
        return;
      }

      setOverview(payload);
      setUnauthorized(false);
      setLoading(false);
    } catch (overviewError) {
      console.error(overviewError);
      setError('Unable to load dashboard data.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const handleCreatePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (creatingPost) {
      return;
    }

    setCreatingPost(true);
    setActionMessage('');

    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...postForm,
          tags: postForm.tags,
        }),
      });
      const payload = await response.json() as { error?: string };

      if (!response.ok) {
        setActionMessage(payload.error || 'Unable to create post.');
        setCreatingPost(false);
        return;
      }

      setPostForm(initialPostForm);
      setActionMessage('Post created successfully.');
      setCreatingPost(false);
      await loadOverview();
    } catch (createError) {
      console.error(createError);
      setActionMessage('Unable to create post.');
      setCreatingPost(false);
    }
  };

  const toggleCommentsStatus = async (post: BlogSummary) => {
    const response = await fetch(`/api/admin/posts/${post.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commentsEnabled: !post.commentsEnabled,
      }),
    });

    if (!response.ok) {
      const payload = await response.json() as { error?: string };
      setActionMessage(payload.error || 'Unable to update post settings.');
      return;
    }

    setActionMessage('Post updated.');
    await loadOverview();
  };

  const deletePost = async (postId: number) => {
    const shouldDelete = window.confirm('Delete this post? This will also remove all related comments and replies.');
    if (!shouldDelete) {
      return;
    }

    const response = await fetch(`/api/admin/posts/${postId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const payload = await response.json() as { error?: string };
      setActionMessage(payload.error || 'Unable to delete post.');
      return;
    }

    setActionMessage('Post deleted.');
    await loadOverview();
  };

  const toggleCommentApproval = async (comment: AdminComment) => {
    const response = await fetch(`/api/admin/comments/${comment.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isApproved: !comment.isApproved,
      }),
    });

    if (!response.ok) {
      const payload = await response.json() as { error?: string };
      setActionMessage(payload.error || 'Unable to update comment.');
      return;
    }

    setActionMessage('Comment updated.');
    await loadOverview();
  };

  const deleteComment = async (commentId: number) => {
    const shouldDelete = window.confirm('Delete this comment and all its replies?');
    if (!shouldDelete) {
      return;
    }

    const response = await fetch(`/api/admin/comments/${commentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const payload = await response.json() as { error?: string };
      setActionMessage(payload.error || 'Unable to delete comment.');
      return;
    }

    setActionMessage('Comment deleted.');
    await loadOverview();
  };

  const submitOwnerReply = async (commentId: number) => {
    const draft = (replyDrafts[commentId] || '').trim();
    if (!draft || replyingToCommentId) {
      return;
    }

    setReplyingToCommentId(commentId);
    const response = await fetch(`/api/admin/comments/${commentId}/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: draft }),
    });

    if (!response.ok) {
      const payload = await response.json() as { error?: string };
      setActionMessage(payload.error || 'Unable to send reply.');
      setReplyingToCommentId(null);
      return;
    }

    setReplyDrafts((prev) => ({
      ...prev,
      [commentId]: '',
    }));
    setActionMessage('Reply sent.');
    setReplyingToCommentId(null);
    await loadOverview();
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/dashboard/login');
    router.refresh();
  };

  if (loading) {
    return (
      <section className="section-container pt-32 pb-24">
        <p>Loading dashboard...</p>
      </section>
    );
  }

  if (unauthorized) {
    return (
      <section className="section-container pt-32 pb-24">
        <div className="max-w-xl border border-light rounded-sm p-8 bg-tertiary">
          <h1 className="text-3xl font-black">Admin session required</h1>
          <p className="mt-3">Please sign in to access dashboard controls.</p>
          <Link
            href="/dashboard/login"
            className="inline-block mt-6 bg-brand-orange hover:bg-orange-700 text-white px-5 py-3 rounded-sm font-bold uppercase tracking-wider"
          >
            Go to Login
          </Link>
        </div>
      </section>
    );
  }

  if (!overview || error) {
    return (
      <section className="section-container pt-32 pb-24">
        <p className="text-red-500 font-medium">{error || 'Unable to load dashboard data.'}</p>
      </section>
    );
  }

  return (
    <section className="section-container pt-32 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted mb-3">Admin Dashboard</p>
          <h1 className="text-4xl font-black">Blog Management</h1>
          <p className="mt-2">Create posts, control comments, and monitor activity stats.</p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/blog"
            className="border border-light hover:border-brand-orange px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-wider"
          >
            View Blog
          </Link>
          <button
            type="button"
            onClick={logout}
            className="bg-brand-black hover:bg-zinc-800 text-white px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-wider"
          >
            Logout
          </button>
        </div>
      </div>

      {actionMessage && (
        <p className="mb-6 text-sm font-medium text-secondary">{actionMessage}</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        <div className="border border-light rounded-sm p-5 bg-tertiary">
          <p className="text-xs uppercase tracking-wider text-muted font-bold">Total Posts</p>
          <p className="text-3xl font-black mt-2">{overview.stats.totalPosts}</p>
        </div>
        <div className="border border-light rounded-sm p-5 bg-tertiary">
          <p className="text-xs uppercase tracking-wider text-muted font-bold">Total Comments</p>
          <p className="text-3xl font-black mt-2">{overview.stats.totalComments}</p>
          <p className="text-sm mt-2 text-secondary">Pending: {overview.stats.pendingComments}</p>
        </div>
        <div className="border border-light rounded-sm p-5 bg-tertiary">
          <p className="text-xs uppercase tracking-wider text-muted font-bold">Total Replies</p>
          <p className="text-3xl font-black mt-2">{overview.stats.totalReplies}</p>
        </div>
        <div className="border border-light rounded-sm p-5 bg-tertiary">
          <p className="text-xs uppercase tracking-wider text-muted font-bold">Blog Views</p>
          <p className="text-3xl font-black mt-2">{overview.stats.totalBlogViews}</p>
        </div>
        <div className="border border-light rounded-sm p-5 bg-tertiary">
          <p className="text-xs uppercase tracking-wider text-muted font-bold">Tracked Visits</p>
          <p className="text-3xl font-black mt-2">{overview.stats.totalPageViews}</p>
        </div>
      </div>

      <div className="border border-light rounded-sm p-6 md:p-8 bg-tertiary mb-12">
        <h2 className="text-2xl font-black">Create New Post</h2>
        <form onSubmit={handleCreatePost} className="mt-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              required
              value={postForm.title}
              onChange={(event) => setPostForm((prev) => ({ ...prev, title: event.target.value }))}
              className="w-full border border-light rounded-sm px-4 py-3 bg-background"
            />
            <input
              type="text"
              placeholder="Slug (optional)"
              value={postForm.slug}
              onChange={(event) => setPostForm((prev) => ({ ...prev, slug: event.target.value }))}
              className="w-full border border-light rounded-sm px-4 py-3 bg-background"
            />
            <input
              type="text"
              placeholder="Category"
              value={postForm.category}
              onChange={(event) => setPostForm((prev) => ({ ...prev, category: event.target.value }))}
              className="w-full border border-light rounded-sm px-4 py-3 bg-background"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={postForm.tags}
              onChange={(event) => setPostForm((prev) => ({ ...prev, tags: event.target.value }))}
              className="w-full border border-light rounded-sm px-4 py-3 bg-background"
            />
          </div>

          <input
            type="url"
            placeholder="Cover image URL (optional)"
            value={postForm.imageUrl}
            onChange={(event) => setPostForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
            className="w-full border border-light rounded-sm px-4 py-3 bg-background"
          />

          <textarea
            rows={3}
            placeholder="Short excerpt"
            value={postForm.excerpt}
            onChange={(event) => setPostForm((prev) => ({ ...prev, excerpt: event.target.value }))}
            className="w-full border border-light rounded-sm px-4 py-3 bg-background"
          />

          <textarea
            rows={10}
            required
            placeholder="Full post content"
            value={postForm.content}
            onChange={(event) => setPostForm((prev) => ({ ...prev, content: event.target.value }))}
            className="w-full border border-light rounded-sm px-4 py-3 bg-background"
          />

          <label className="inline-flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={postForm.commentsEnabled}
              onChange={(event) => setPostForm((prev) => ({ ...prev, commentsEnabled: event.target.checked }))}
            />
            Enable comments for this post
          </label>

          <div>
            <button
              type="submit"
              disabled={creatingPost}
              className="bg-brand-orange hover:bg-orange-700 disabled:opacity-60 text-white px-5 py-3 rounded-sm font-bold uppercase tracking-wider text-sm"
            >
              {creatingPost ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>

      <div className="border border-light rounded-sm p-6 md:p-8 bg-tertiary mb-12">
        <h2 className="text-2xl font-black">Posts</h2>
        <div className="mt-6 space-y-4">
          {overview.posts.map((post) => (
            <div key={post.id} className="border border-light rounded-sm p-4 bg-background">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black">{post.title}</h3>
                  <p className="text-sm text-secondary mt-1">
                    /blog/{post.slug} • {post.views} views • {post.commentsCount} comments
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleCommentsStatus(post)}
                    className="border border-light hover:border-brand-orange px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wider"
                  >
                    {post.commentsEnabled ? 'Disable Comments' : 'Enable Comments'}
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePost(post.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wider"
                  >
                    Delete Post
                  </button>
                </div>
              </div>
            </div>
          ))}
          {overview.posts.length === 0 && (
            <p className="text-muted">No posts available.</p>
          )}
        </div>
      </div>

      <div className="border border-light rounded-sm p-6 md:p-8 bg-tertiary">
        <h2 className="text-2xl font-black">Comments & Replies</h2>
        <div className="mt-6 space-y-5">
          {overview.comments.map((comment) => (
            <div key={comment.id} className="border border-light rounded-sm p-5 bg-background">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted font-bold">
                    {comment.blogTitle}
                  </p>
                  <h3 className="text-lg font-bold mt-1">{comment.name}</h3>
                  {comment.email && (
                    <p className="text-sm text-secondary">{comment.email}</p>
                  )}
                  <p className="text-sm text-muted mt-1">{formatDate(comment.createdAt)}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleCommentApproval(comment)}
                    className="border border-light hover:border-brand-orange px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wider"
                  >
                    {comment.isApproved ? 'Unapprove' : 'Approve'}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteComment(comment.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wider"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-wrap">{comment.content}</p>

              {comment.replies.length > 0 && (
                <div className="mt-4 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="ml-4 border-l-2 border-light pl-4">
                      <p className="font-bold text-sm">
                        {reply.name}{' '}
                        {reply.isOwner && (
                          <span className="text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-1 rounded-sm">
                            ✔ Verified
                          </span>
                        )}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm">{reply.content}</p>
                      <p className="text-xs text-muted mt-2">{formatDate(reply.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 space-y-3">
                <textarea
                  rows={3}
                  placeholder="Reply as owner (will show verified tick)"
                  value={replyDrafts[comment.id] || ''}
                  onChange={(event) => setReplyDrafts((prev) => ({
                    ...prev,
                    [comment.id]: event.target.value,
                  }))}
                  className="w-full border border-light rounded-sm px-3 py-2 bg-background"
                />
                <button
                  type="button"
                  onClick={() => submitOwnerReply(comment.id)}
                  disabled={replyingToCommentId === comment.id}
                  className="bg-brand-black hover:bg-zinc-800 disabled:opacity-60 text-white px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-wider"
                >
                  {replyingToCommentId === comment.id ? 'Replying...' : 'Reply as Verified Owner'}
                </button>
              </div>
            </div>
          ))}
          {overview.comments.length === 0 && (
            <p className="text-muted">No comments yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
