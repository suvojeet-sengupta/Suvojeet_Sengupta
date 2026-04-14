'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { BlogComment, BlogPost, BlogReply } from '@/types/blog';

interface PostResponse {
  post: BlogPost;
  error?: string;
}

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

export default function BlogPostPage() {
  const params = useParams();
  const slug = useMemo(() => {
    const rawSlug = params?.slug;
    return Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  }, [params]);

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentForm, setCommentForm] = useState({ name: '', email: '', content: '' });
  const [postingComment, setPostingComment] = useState(false);
  const [commentMessage, setCommentMessage] = useState('');
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<number | null>(null);
  const [replyForms, setReplyForms] = useState<Record<number, { name: string; content: string }>>({});
  const [postingReplyCommentId, setPostingReplyCommentId] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('Invalid blog URL.');
      setLoading(false);
      return;
    }

    const loadPost = async () => {
      try {
        const response = await fetch(`/api/public/posts/${encodeURIComponent(slug)}`, {
          cache: 'no-store',
        });
        const payload = await response.json() as PostResponse;

        if (!response.ok) {
          setError(payload.error || 'Unable to load this blog post.');
          setLoading(false);
          return;
        }

        setPost(payload.post);
        setLoading(false);
      } catch (fetchError) {
        console.error(fetchError);
        setError('Unable to load this blog post.');
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  const submitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!post || postingComment) {
      return;
    }

    setCommentMessage('');
    setPostingComment(true);

    try {
      const response = await fetch(`/api/public/posts/${post.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentForm),
      });
      const payload = await response.json() as { comment?: BlogComment; error?: string };

      if (!response.ok || !payload.comment) {
        setCommentMessage(payload.error || 'Unable to post comment right now.');
        setPostingComment(false);
        return;
      }

      setPost((prev) => {
        if (!prev) {
          return prev;
        }
        return {
          ...prev,
          comments: [payload.comment as BlogComment, ...prev.comments],
          commentsCount: prev.commentsCount + 1,
        };
      });
      setCommentForm({ name: '', email: '', content: '' });
      setCommentMessage('Comment posted successfully.');
      setPostingComment(false);
    } catch (submitError) {
      console.error(submitError);
      setCommentMessage('Unable to post comment right now.');
      setPostingComment(false);
    }
  };

  const submitReply = async (commentId: number) => {
    if (!post || postingReplyCommentId) {
      return;
    }

    const currentForm = replyForms[commentId] || { name: '', content: '' };
    if (!currentForm.name.trim() || !currentForm.content.trim()) {
      return;
    }

    setPostingReplyCommentId(commentId);

    try {
      const response = await fetch(`/api/public/comments/${commentId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentForm),
      });
      const payload = await response.json() as { reply?: BlogReply; error?: string };

      if (!response.ok || !payload.reply) {
        setPostingReplyCommentId(null);
        return;
      }

      setPost((prev) => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,
          comments: prev.comments.map((comment) => {
            if (comment.id !== commentId) {
              return comment;
            }
            return {
              ...comment,
              replies: [...comment.replies, payload.reply as BlogReply],
            };
          }),
        };
      });

      setReplyForms((prev) => ({
        ...prev,
        [commentId]: { name: '', content: '' },
      }));
      setActiveReplyCommentId(null);
      setPostingReplyCommentId(null);
    } catch (replyError) {
      console.error(replyError);
      setPostingReplyCommentId(null);
    }
  };

  if (loading) {
    return (
      <section className="section-container pt-32 pb-24">
        <p>Loading post...</p>
      </section>
    );
  }

  if (error || !post) {
    return (
      <section className="section-container pt-32 pb-24">
        <p className="text-red-500 font-medium">{error || 'Post not found.'}</p>
        <Link href="/blog" className="inline-block mt-6 text-brand-orange font-bold">
          ← Back to blog
        </Link>
      </section>
    );
  }

  return (
    <section className="section-container pt-32 pb-24">
      <Link href="/blog" className="text-brand-orange text-sm font-bold uppercase tracking-wider">
        ← Back to all posts
      </Link>

      <article className="mt-6 border border-light rounded-sm p-6 md:p-10 bg-tertiary">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider font-bold">
          {post.category && <span className="bg-brand-orange text-white px-3 py-1 rounded-sm">{post.category}</span>}
          <span className="text-muted">{formatDate(post.publishedAt)}</span>
          <span className="text-muted">{post.views} views</span>
          <span className="text-muted">{post.commentsCount} comments</span>
        </div>

        <h1 className="mt-6 text-4xl md:text-5xl font-black leading-tight">{post.title}</h1>

        <p className="mt-4 text-secondary">
          By <span className="font-bold text-primary">{post.author}</span>
        </p>

        {post.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs border border-light px-2 py-1 rounded-sm text-secondary">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8 whitespace-pre-wrap leading-8 text-[1.04rem] text-secondary">
          {post.content}
        </div>
      </article>

      <section className="mt-10 border border-light rounded-sm p-6 md:p-8 bg-background">
        <h2 className="text-2xl font-black">Comments ({post.comments.length})</h2>

        {!post.commentsEnabled && (
          <p className="mt-3 text-muted">Comments are currently disabled for this post.</p>
        )}

        {post.commentsEnabled && (
          <form onSubmit={submitComment} className="mt-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your name"
                required
                value={commentForm.name}
                onChange={(event) => setCommentForm((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full border border-light rounded-sm px-4 py-3 bg-background"
              />
              <input
                type="email"
                placeholder="Your email (optional)"
                value={commentForm.email}
                onChange={(event) => setCommentForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full border border-light rounded-sm px-4 py-3 bg-background"
              />
            </div>
            <textarea
              placeholder="Write your comment..."
              required
              rows={4}
              value={commentForm.content}
              onChange={(event) => setCommentForm((prev) => ({ ...prev, content: event.target.value }))}
              className="w-full border border-light rounded-sm px-4 py-3 bg-background"
            />
            <button
              type="submit"
              disabled={postingComment}
              className="bg-brand-orange hover:bg-orange-700 disabled:opacity-60 text-white px-5 py-3 rounded-sm font-bold uppercase tracking-wider text-sm"
            >
              {postingComment ? 'Posting...' : 'Post comment'}
            </button>
            {commentMessage && <p className="text-sm text-secondary">{commentMessage}</p>}
          </form>
        )}

        <div className="mt-8 space-y-6">
          {post.comments.map((comment) => (
            <div key={comment.id} className="border border-light rounded-sm p-5 bg-tertiary">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-bold">{comment.name}</span>
                <span className="text-muted">• {formatDate(comment.createdAt)}</span>
              </div>
              <p className="mt-3 whitespace-pre-wrap">{comment.content}</p>

              <div className="mt-4 space-y-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="ml-4 border-l-2 border-light pl-4">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-bold">{reply.name}</span>
                      {reply.isOwner && (
                        <span className="text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-1 rounded-sm">
                          ✔ Verified
                        </span>
                      )}
                      <span className="text-muted">• {formatDate(reply.createdAt)}</span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap">{reply.content}</p>
                  </div>
                ))}
              </div>

              {post.commentsEnabled && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setActiveReplyCommentId((prev) => (prev === comment.id ? null : comment.id))}
                    className="text-brand-orange text-sm font-bold uppercase tracking-wider"
                  >
                    Reply
                  </button>

                  {activeReplyCommentId === comment.id && (
                    <div className="mt-3 space-y-3 border border-light rounded-sm p-4 bg-background">
                      <input
                        type="text"
                        placeholder="Your name"
                        value={replyForms[comment.id]?.name || ''}
                        onChange={(event) => setReplyForms((prev) => ({
                          ...prev,
                          [comment.id]: {
                            name: event.target.value,
                            content: prev[comment.id]?.content || '',
                          },
                        }))}
                        className="w-full border border-light rounded-sm px-3 py-2 bg-background"
                      />
                      <textarea
                        rows={3}
                        placeholder="Write your reply..."
                        value={replyForms[comment.id]?.content || ''}
                        onChange={(event) => setReplyForms((prev) => ({
                          ...prev,
                          [comment.id]: {
                            name: prev[comment.id]?.name || '',
                            content: event.target.value,
                          },
                        }))}
                        className="w-full border border-light rounded-sm px-3 py-2 bg-background"
                      />
                      <button
                        type="button"
                        onClick={() => submitReply(comment.id)}
                        disabled={postingReplyCommentId === comment.id}
                        className="bg-brand-black hover:bg-zinc-800 disabled:opacity-60 text-white px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-wider"
                      >
                        {postingReplyCommentId === comment.id ? 'Posting...' : 'Post reply'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {post.comments.length === 0 && (
            <p className="text-muted">No comments yet. Be the first to comment.</p>
          )}
        </div>
      </section>
    </section>
  );
}
