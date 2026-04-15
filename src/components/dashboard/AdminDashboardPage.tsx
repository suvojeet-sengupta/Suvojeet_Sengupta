'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { BlogReply, BlogSummary } from '@/types/blog';
import { 
  LayoutDashboard, FileText, MessageSquare, 
  Eye, CheckCircle, Trash2, Edit3, Globe, 
  LogOut, PlusCircle, Reply, PowerOff, ShieldCheck
} from 'lucide-react';

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

  const deleteReply = async (replyId: number) => {
    const shouldDelete = window.confirm('Delete this reply?');
    if (!shouldDelete) {
      return;
    }

    const response = await fetch(`/api/admin/replies/${replyId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const payload = await response.json() as { error?: string };
      setActionMessage(payload.error || 'Unable to delete reply.');
      return;
    }

    setActionMessage('Reply deleted.');
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
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-full">
            <LayoutDashboard size={32} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted mb-1">Admin Control Center</p>
            <h1 className="text-4xl font-black">Dashboard</h1>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <Link
            href="/blog"
            className="flex items-center gap-2 border border-light hover:border-brand-orange hover:text-brand-orange px-4 py-2.5 rounded-sm text-sm font-bold uppercase tracking-wider transition-colors"
          >
            <Globe size={16} />
            View Live
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2.5 rounded-sm text-sm font-bold uppercase tracking-wider transition-colors"
          >
            <PowerOff size={16} />
            Logout
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-sm flex items-center gap-3 text-green-700">
          <CheckCircle size={20} />
          <p className="text-sm font-bold">{actionMessage}</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="border border-light/60 shadow-sm rounded-xl p-6 bg-tertiary flex items-center justify-between group hover:border-brand-orange/40 transition-colors">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted font-bold">Total Posts</p>
            <p className="text-4xl font-black mt-2 text-primary">{overview.stats.totalPosts}</p>
          </div>
          <div className="p-4 bg-brand-orange/10 rounded-full text-brand-orange group-hover:scale-110 transition-transform">
            <Edit3 size={24} />
          </div>
        </div>

        <div className="border border-light/60 shadow-sm rounded-xl p-6 bg-tertiary flex items-center justify-between group hover:border-brand-orange/40 transition-colors">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-wider text-muted font-bold">Comments</p>
              {overview.stats.pendingComments > 0 && (
                <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold">
                  {overview.stats.pendingComments} pending
                </span>
              )}
            </div>
            <p className="text-4xl font-black mt-2 text-primary">{overview.stats.totalComments}</p>
          </div>
          <div className="p-4 bg-blue-500/10 rounded-full text-blue-500 group-hover:scale-110 transition-transform">
            <MessageSquare size={24} />
          </div>
        </div>

        <div className="border border-light/60 shadow-sm rounded-xl p-6 bg-tertiary flex items-center justify-between group hover:border-brand-orange/40 transition-colors">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted font-bold">Post Views</p>
            <p className="text-4xl font-black mt-2 text-primary">{overview.stats.totalBlogViews}</p>
          </div>
          <div className="p-4 bg-green-500/10 rounded-full text-green-500 group-hover:scale-110 transition-transform">
            <Eye size={24} />
          </div>
        </div>
      </div>

      <div className="border border-light/60 shadow-sm rounded-xl p-6 md:p-8 bg-tertiary mb-12">
        <div className="flex items-center gap-3 mb-6">
          <PlusCircle className="text-brand-orange" />
          <h2 className="text-2xl font-black">Publish New Post</h2>
        </div>
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

      <div className="border border-light/60 shadow-sm rounded-xl p-6 md:p-8 bg-tertiary mb-12">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="text-brand-orange" />
          <h2 className="text-2xl font-black">Manage Posts</h2>
        </div>
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

      <div className="border border-light/60 shadow-sm rounded-xl p-6 md:p-8 bg-tertiary">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="text-brand-orange" />
          <h2 className="text-2xl font-black">Comments Moderation</h2>
        </div>
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
                    className="flex items-center gap-1 border border-light hover:border-brand-orange px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <ShieldCheck size={14} />
                    {comment.isApproved ? 'Unapprove' : 'Approve'}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteComment(comment.id)}
                    className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-transparent px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-wrap">{comment.content}</p>

              {comment.replies.length > 0 && (
                <div className="mt-4 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="ml-4 border-l-2 border-light pl-4 flex items-start justify-between gap-4 group">
                      <div>
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

                      <button
                        type="button"
                        onClick={() => deleteReply(reply.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-sm transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                        title="Delete Reply"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
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
