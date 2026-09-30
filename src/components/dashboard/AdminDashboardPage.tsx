'use client';

import { apiUrl } from '@/lib/api-base';
import Image from 'next/image';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { BlogReply, BlogSummary } from '@/types/blog';
import { LayoutDashboard, FileText, MessageSquare, Inbox, Music, Users, X } from 'lucide-react';
import type { MusicVideo } from '@/types/music';
import { FormattedDate } from '@/components/common/FormattedDate';

interface DashboardStats {
  totalPosts: number;
  totalComments: number;
  pendingComments: number;
  totalReplies: number;
  totalBlogViews: number;
  totalPageViews: number;
  totalSubscribers: number;
  totalVideos: number;
  totalMessages: number;
  unreadMessages: number;
}

interface SystemStatus {
  isOnline: boolean;
  databaseSizeKb: number;
}

interface AdminMessage {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  type: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
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
  system: SystemStatus;
  posts: BlogSummary[];
  comments: AdminComment[];
  videos: MusicVideo[];
  messages: AdminMessage[];
  settings?: Record<string, string>;
}

interface AdminUser {
  email: string;
  name?: string;
  createdAt: string;
}

interface PostFormState {
  id?: number;
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

interface VideoFormState {
  title: string;
  videoUrl: string;
  description: string;
}

const initialVideoForm: VideoFormState = {
  title: '',
  videoUrl: '',
  description: '',
};

interface UserFormState {
  email: string;
  password: string;
  name: string;
}

const initialUserForm: UserFormState = {
  email: '',
  password: '',
  name: '',
};

type DashboardTab = 'overview' | 'posts' | 'comments' | 'inbox' | 'music' | 'users';
const DASHBOARD_TABS: DashboardTab[] = ['overview', 'posts', 'comments', 'inbox', 'music', 'users'];

const MESSAGE_TYPE_LABELS: Record<string, string> = {
  GENERAL: 'General',
  PROJECT: 'Project',
  SONG: 'Song request',
  ROM: 'ROM',
};

const btnBase = 'inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[13px] whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
const btnGhost = `${btnBase} border-[color:var(--line-strong)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:border-[color:var(--text-primary)]`;
const btnPrimary = `${btnBase} border-[color:var(--text-primary)] bg-[color:var(--text-primary)] text-[color:var(--bg-primary)] hover:opacity-85`;
const btnDanger = `${btnBase} border-[color:var(--line-strong)] text-[color:var(--text-secondary)] hover:text-[color:var(--danger)] hover:border-[color:var(--danger)]`;
const selectClass = 'rounded-full border border-[color:var(--line-strong)] bg-transparent px-3 py-1.5 text-[13px] text-[color:var(--text-primary)] outline-none cursor-pointer';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [session, setSession] = useState<{ email: string; isSuperAdmin: boolean } | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState('');
  const [postForm, setPostForm] = useState<PostFormState>(initialPostForm);
  const [isEditing, setIsEditing] = useState(false);
  const [submittingPost, setSubmittingPost] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(null);

  const [selectedPostForComments, setSelectedPostForComments] = useState<number | 'all'>('all');
  const [commentSortOrder, setCommentSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [commentFilter, setCommentFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [bulkActioning, setBulkActioning] = useState(false);

  const [videoForm, setVideoForm] = useState<VideoFormState>(initialVideoForm);
  const [submittingVideo, setSubmittingVideo] = useState(false);
  const [isVideoFormOpen, setIsVideoFormOpen] = useState(false);

  const [updatingSettings, setUpdatingSettings] = useState(false);

  const [userForm, setUserForm] = useState<UserFormState>(initialUserForm);
  const [submittingUser, setSubmittingUser] = useState(false);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUserEmail, setEditingUserEmail] = useState<string | null>(null);
  const [tab, setTab] = useState<DashboardTab>('overview');

  // Keep the open tab in the URL hash so a refresh stays on the same section
  useEffect(() => {
    const syncFromHash = () => {
      const fromHash = window.location.hash.slice(1) as DashboardTab;
      if (DASHBOARD_TABS.includes(fromHash)) setTab(fromHash);
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const changeTab = useCallback((next: DashboardTab) => {
    setTab(next);
    window.history.replaceState(null, '', `#${next}`);
    window.scrollTo({ top: 0 });
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(apiUrl('/api/admin/users'), { credentials: 'include' });
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  }, []);

  const loadOverview = useCallback(async () => {
    setError('');
    try {
      const sessionRes = await fetch(apiUrl('/api/admin/session'), { credentials: 'include' });
      const sessionData = await sessionRes.json();
      setSession(sessionData.authenticated ? { email: sessionData.email, isSuperAdmin: sessionData.isSuperAdmin } : null);

      const response = await fetch(apiUrl('/api/admin/overview'), { cache: 'no-store', credentials: 'include' });
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
      await fetchUsers();
    } catch (overviewError) {
      console.error(overviewError);
      setError('Unable to load dashboard data.');
      setLoading(false);
    }
  }, [fetchUsers]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const handlePostSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingPost) {
      return;
    }

    setSubmittingPost(true);
    setActionMessage('');

    const url = isEditing ? apiUrl(`/api/admin/posts/${postForm.id}`) : apiUrl('/api/admin/posts');
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...postForm,
        }),
        credentials: 'include',
      });
      const payload = await response.json() as { error?: string };

      if (!response.ok) {
        setActionMessage(payload.error || `Unable to ${isEditing ? 'update' : 'create'} post.`);
        setSubmittingPost(false);
        return;
      }

      setPostForm(initialPostForm);
      setIsEditing(false);
      setIsFormOpen(false);
      setActionMessage(`Post ${isEditing ? 'updated' : 'created'} successfully.`);
      setSubmittingPost(false);
      await loadOverview();
    } catch (submitError) {
      console.error(submitError);
      setActionMessage(`Unable to ${isEditing ? 'update' : 'create'} post.`);
      setSubmittingPost(false);
    }
  };

  const handleVideoSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingVideo) {
      return;
    }

    setSubmittingVideo(true);
    setActionMessage('');

    try {
      const response = await fetch(apiUrl('/api/admin/music-videos'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videoForm),
        credentials: 'include',
      });
      const payload = await response.json() as { error?: string };

      if (!response.ok) {
        setActionMessage(payload.error || 'Unable to add video.');
        setSubmittingVideo(false);
        return;
      }

      setVideoForm(initialVideoForm);
      setIsVideoFormOpen(false);
      setActionMessage('Video added successfully.');
      setSubmittingVideo(false);
      await loadOverview();
    } catch (err) {
      console.error(err);
      setActionMessage('Unable to add video.');
      setSubmittingVideo(false);
    }
  };

  const handleUserSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingUser) return;

    setSubmittingUser(true);
    setActionMessage('');

    const method = editingUserEmail ? 'PUT' : 'POST';

    try {
      const response = await fetch(apiUrl('/api/admin/users'), {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm),
        credentials: 'include',
      });
      const data = await response.json();

      if (!response.ok) {
        setActionMessage(data.error || `Failed to ${editingUserEmail ? 'update' : 'create'} user`);
      } else {
        setActionMessage(`User ${editingUserEmail ? 'updated' : 'created'} successfully`);
        setUserForm(initialUserForm);
        setIsUserFormOpen(false);
        setEditingUserEmail(null);
        await fetchUsers();
      }
    } catch (err) {
      setActionMessage(`Failed to ${editingUserEmail ? 'update' : 'create'} user`);
    } finally {
      setSubmittingUser(false);
    }
  };

  const startEditUser = (user: AdminUser) => {
    setUserForm({
      email: user.email,
      password: '', // Keep empty unless changing
      name: user.name || '',
    });
    setEditingUserEmail(user.email);
    setIsUserFormOpen(true);
    changeTab('users');
  };

  const cancelUserEdit = () => {
    setUserForm(initialUserForm);
    setEditingUserEmail(null);
    setIsUserFormOpen(false);
  };

  const deleteUser = async (email: string) => {
    if (!window.confirm(`Delete user ${email}?`)) return;

    try {
      const response = await fetch(apiUrl(`/api/admin/users?email=${encodeURIComponent(email)}`), {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setActionMessage('User deleted');
        await fetchUsers();
      } else {
        const data = await response.json();
        setActionMessage(data.error || 'Failed to delete user');
      }
    } catch (err) {
      setActionMessage('Failed to delete user');
    }
  };

  const deleteVideo = async (videoId: number) => {
    const shouldDelete = window.confirm('Delete this video?');
    if (!shouldDelete) {
      return;
    }

    const response = await fetch(apiUrl(`/api/admin/music-videos/${videoId}`), {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const payload = await response.json() as { error?: string };
      setActionMessage(payload.error || 'Unable to delete video.');
      return;
    }

    setActionMessage('Video deleted.');
    await loadOverview();
  };

  const startEditPost = async (postId: number) => {
      setActionMessage('Fetching post data...');
      try {
          // We need full content, which might not be in the summary.
          // In this project structure, GET /api/admin/posts/[id] usually exists.
          const response = await fetch(apiUrl(`/api/admin/posts/${postId}`), { credentials: 'include' });
          const payload = await response.json() as any;
          
          if (!response.ok) throw new Error(payload.error || 'Failed to fetch post');
          
          const postData = payload.post;
          setPostForm({
              id: postData.id,
              title: postData.title,
              slug: postData.slug,
              excerpt: postData.excerpt || '',
              category: postData.category || '',
              imageUrl: postData.imageUrl || '',
              tags: Array.isArray(postData.tags) ? postData.tags.join(', ') : '',
              content: postData.content || '',
              commentsEnabled: postData.commentsEnabled
          });
          setIsEditing(true);
          setIsFormOpen(true);
          setActionMessage('');
          changeTab('posts');
      } catch (err: any) {
          setActionMessage(err.message);
      }
  };

  const cancelEdit = () => {
      setPostForm(initialPostForm);
      setIsEditing(false);
      setIsFormOpen(false);
  };

  const toggleCommentsStatus = async (post: BlogSummary) => {
    const response = await fetch(apiUrl(`/api/admin/posts/${post.id}`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commentsEnabled: !post.commentsEnabled,
      }),
      credentials: 'include',
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

    const response = await fetch(apiUrl(`/api/admin/posts/${postId}`), {
      method: 'DELETE',
      credentials: 'include',
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
    const newApproved = !comment.isApproved;
    setOverview(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        comments: prev.comments.map(c => c.id === comment.id ? { ...c, isApproved: newApproved } : c),
        stats: { ...prev.stats, pendingComments: prev.stats.pendingComments + (newApproved ? -1 : 1) },
      };
    });

    const response = await fetch(apiUrl(`/api/admin/comments/${comment.id}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isApproved: newApproved }),
      credentials: 'include',
    });

    if (!response.ok) {
      setOverview(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: prev.comments.map(c => c.id === comment.id ? { ...c, isApproved: comment.isApproved } : c),
          stats: { ...prev.stats, pendingComments: prev.stats.pendingComments + (newApproved ? 1 : -1) },
        };
      });
      const payload = await response.json() as { error?: string };
      setActionMessage(payload.error || 'Unable to update comment.');
      return;
    }

    setActionMessage(newApproved ? 'Comment approved.' : 'Comment unapproved.');
  };

  const deleteComment = async (commentId: number) => {
    const shouldDelete = window.confirm('Delete this comment and all its replies?');
    if (!shouldDelete) return;

    const target = overview?.comments.find(c => c.id === commentId);
    const wasPending = target ? !target.isApproved : false;

    setOverview(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        comments: prev.comments.filter(c => c.id !== commentId),
        stats: {
          ...prev.stats,
          totalComments: prev.stats.totalComments - 1,
          pendingComments: prev.stats.pendingComments - (wasPending ? 1 : 0),
        },
      };
    });

    const response = await fetch(apiUrl(`/api/admin/comments/${commentId}`), { 
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const payload = await response.json() as { error?: string };
      setActionMessage(payload.error || 'Unable to delete comment.');
      await loadOverview();
      return;
    }

    setActionMessage('Comment deleted.');
  };

  const deleteReply = async (replyId: number) => {
    const shouldDelete = window.confirm('Delete this reply?');
    if (!shouldDelete) return;

    setOverview(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        comments: prev.comments.map(c => ({ ...c, replies: c.replies.filter(r => r.id !== replyId) })),
        stats: { ...prev.stats, totalReplies: prev.stats.totalReplies - 1 },
      };
    });

    const response = await fetch(apiUrl(`/api/admin/replies/${replyId}`), { 
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const payload = await response.json() as { error?: string };
      setActionMessage(payload.error || 'Unable to delete reply.');
      await loadOverview();
      return;
    }

    setActionMessage('Reply deleted.');
  };

  const updateSetting = async (key: string, value: string) => {
    if (updatingSettings) return;

    const previousSettings = { ...overview?.settings };
    setOverview(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        settings: {
          ...prev.settings,
          [key]: value
        }
      };
    });

    setUpdatingSettings(true);
    try {
      const response = await fetch(apiUrl('/api/admin/settings'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
        credentials: 'include',
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || 'Failed to update setting');
      }
      
      setActionMessage('Settings updated successfully.');
    } catch (err: any) {
      console.error(err);
      setActionMessage(err.message || 'Unable to update setting.');
      // Rollback
      setOverview(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          settings: previousSettings as Record<string, string>
        };
      });
    } finally {
      setUpdatingSettings(false);
    }
  };

  const bulkAction = async (action: 'approve_all_pending' | 'delete_all_pending') => {
    const label = action === 'approve_all_pending'
      ? 'Approve all pending comments?'
      : 'Delete all pending comments and their replies?';
    if (!window.confirm(label)) return;

    setBulkActioning(true);
    const response = await fetch(apiUrl('/api/admin/comments/bulk'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
      credentials: 'include',
    });
    setBulkActioning(false);

    if (!response.ok) {
      const payload = await response.json() as { error?: string };
      setActionMessage(payload.error || 'Bulk action failed.');
      return;
    }

    const payload = await response.json() as { affected: number };
    setActionMessage(`${payload.affected} comment${payload.affected !== 1 ? 's' : ''} ${action === 'approve_all_pending' ? 'approved' : 'deleted'}.`);
    await loadOverview();
  };

  const toggleMessageRead = async (message: AdminMessage) => {
    const response = await fetch(apiUrl(`/api/admin/messages/${message.id}`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isRead: !message.isRead,
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      const payload = await response.json() as { error?: string };
      setActionMessage(payload.error || 'Unable to update message.');
      return;
    }

    await loadOverview();
  };

  const deleteMessage = async (messageId: number) => {
    const shouldDelete = window.confirm('Delete this message?');
    if (!shouldDelete) {
      return;
    }

    const response = await fetch(apiUrl(`/api/admin/messages/${messageId}`), {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const payload = await response.json() as { error?: string };
      setActionMessage(payload.error || 'Unable to delete message.');
      return;
    }

    setActionMessage('Message deleted.');
    await loadOverview();
  };

  const submitOwnerReply = async (commentId: number) => {
    const draft = (replyDrafts[commentId] || '').trim();
    if (!draft || replyingToCommentId) return;

    const target = overview?.comments.find(c => c.id === commentId);
    const autoApprove = target ? !target.isApproved : false;

    setReplyingToCommentId(commentId);

    if (autoApprove) {
      await fetch(apiUrl(`/api/admin/comments/${commentId}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: true }),
        credentials: 'include',
      });
    }

    const response = await fetch(apiUrl(`/api/admin/comments/${commentId}/replies`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: draft }),
      credentials: 'include',
    });

    if (!response.ok) {
      const payload = await response.json() as { error?: string };
      setActionMessage(payload.error || 'Unable to send reply.');
      setReplyingToCommentId(null);
      return;
    }

    setReplyDrafts(prev => ({ ...prev, [commentId]: '' }));
    setActionMessage(autoApprove ? 'Comment approved and reply sent.' : 'Reply sent.');
    setReplyingToCommentId(null);
    await loadOverview();
  };

  const logout = async () => {
    await fetch(apiUrl('/api/admin/logout'), { 
      method: 'POST',
      credentials: 'include',
    });
    router.push('/dashboard/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="page">
        <p className="page-eyebrow">Admin</p>
        <p className="text-[16px]">Loading dashboard…</p>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="page max-w-xl">
        <p className="page-eyebrow">Admin</p>
        <h1 className="text-[clamp(32px,4vw,44px)] leading-tight mb-3">Sign in required</h1>
        <p className="text-[16px] mb-8">Your session has ended or you haven&apos;t signed in yet.</p>
        <Link href="/dashboard/login" className="btn-solid">Go to sign in</Link>
      </div>
    );
  }

  if (!overview || error) {
    return (
      <div className="page max-w-xl">
        <p className="page-eyebrow">Admin</p>
        <h1 className="text-[clamp(32px,4vw,44px)] leading-tight mb-3">Couldn&apos;t load the dashboard</h1>
        <p role="alert" className="text-[16px] text-[color:var(--danger)] mb-8">{error || 'Unable to load dashboard data.'}</p>
        <button type="button" onClick={() => { setLoading(true); loadOverview(); }} className="btn-outline">Try again</button>
      </div>
    );
  }

  const { stats } = overview;
  const pendingCount = overview.comments.filter(c => !c.isApproved).length;
  const approvedCount = overview.comments.length - pendingCount;

  const tabs: { id: DashboardTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'comments', label: 'Comments', icon: MessageSquare, badge: stats.pendingComments },
    { id: 'inbox', label: 'Inbox', icon: Inbox, badge: stats.unreadMessages },
    { id: 'music', label: 'Music', icon: Music },
    ...(session?.isSuperAdmin ? [{ id: 'users' as const, label: 'Admins', icon: Users }] : []),
  ];

  const filteredComments = overview.comments
    .filter(c => {
      const matchPost = selectedPostForComments === 'all' || c.blogId === selectedPostForComments;
      const matchFilter =
        commentFilter === 'all' ||
        (commentFilter === 'pending' && !c.isApproved) ||
        (commentFilter === 'approved' && c.isApproved);
      return matchPost && matchFilter;
    })
    .sort((a, b) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return commentSortOrder === 'newest' ? tb - ta : ta - tb;
    });

  const dbLimitKb = 512000; // 500 MB D1 limit
  const dbPercent = Math.min(100, (overview.system.databaseSizeKb / dbLimitKb) * 100);

  return (
    <div className="page !pt-28 sm:!pt-32">
      <header className="flex flex-wrap items-end justify-between gap-6 pb-6 border-b border-[color:var(--line-strong)]">
        <div>
          <p className="page-eyebrow">Admin</p>
          <h1 className="text-[clamp(34px,4.5vw,52px)] leading-none tracking-[-0.03em]">Dashboard</h1>
          {session && (
            <p className="mt-3 text-[14px] text-[color:var(--text-tertiary)]">
              Signed in as {session.email}{session.isSuperAdmin && ' · Super admin'}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Link href="/" target="_blank" className={btnGhost}>View site ↗</Link>
          <button type="button" onClick={logout} className={btnGhost}>Sign out</button>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14">
        <nav aria-label="Dashboard sections" className="lg:sticky lg:top-24 lg:self-start -mx-5 px-5 sm:mx-0 sm:px-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex lg:flex-col gap-1 min-w-max lg:min-w-0">
            {tabs.map(({ id, label, icon: Icon, badge }) => {
              const active = tab === id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => changeTab(id)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-[6px] text-[14px] transition-colors ${
                      active
                        ? 'bg-[color:var(--bg-tertiary)] text-[color:var(--text-primary)]'
                        : 'text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] hover:bg-[color:var(--bg-secondary)]'
                    }`}
                  >
                    <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                    <span>{label}</span>
                    {!!badge && badge > 0 && (
                      <span className="ml-auto pl-2 text-[12px] tabular-nums text-[color:var(--warn)]">{badge}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0">
          {actionMessage && (
            <div role="status" className="mb-8 flex items-start justify-between gap-4 px-4 py-3 rounded-[6px] border border-[color:var(--line-strong)] bg-[color:var(--bg-secondary)] text-[14px] text-[color:var(--text-primary)]">
              <span>{actionMessage}</span>
              <button type="button" onClick={() => setActionMessage('')} aria-label="Dismiss" className="text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]">
                <X size={16} />
              </button>
            </div>
          )}

          {/* ========= OVERVIEW ========= */}
          {tab === 'overview' && (
            <section aria-labelledby="overview-title">
              <PanelHeader id="overview-title" title="Overview" description="Site activity at a glance." />

              <dl className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[color:var(--line)] border border-[color:var(--line)] rounded-[8px] overflow-hidden">
                {[
                  { label: 'Posts', value: stats.totalPosts, to: 'posts' as DashboardTab },
                  { label: 'Blog views', value: stats.totalBlogViews },
                  { label: 'Comments', value: stats.totalComments, note: stats.pendingComments ? `${stats.pendingComments} pending` : undefined, to: 'comments' as DashboardTab },
                  { label: 'Replies', value: stats.totalReplies, to: 'comments' as DashboardTab },
                  { label: 'Messages', value: stats.totalMessages, note: stats.unreadMessages ? `${stats.unreadMessages} unread` : undefined, to: 'inbox' as DashboardTab },
                  { label: 'Music videos', value: stats.totalVideos, to: 'music' as DashboardTab },
                  { label: 'Push subscribers', value: stats.totalSubscribers },
                  { label: 'Page views', value: stats.totalPageViews },
                ].map((item) => {
                  const body = (
                    <>
                      <dt className="text-[13px] text-[color:var(--text-tertiary)]">{item.label}</dt>
                      <dd className="mt-2 font-serif text-[34px] leading-none tracking-[-0.02em] text-[color:var(--text-primary)] tabular-nums">
                        {item.value.toLocaleString()}
                      </dd>
                      {item.note && <dd className="mt-2 text-[12px] text-[color:var(--warn)]">{item.note}</dd>}
                    </>
                  );
                  return item.to ? (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => changeTab(item.to!)}
                      className="flex flex-col items-start justify-start text-left p-5 bg-[color:var(--bg-primary)] hover:bg-[color:var(--bg-secondary)] transition-colors"
                    >
                      {body}
                    </button>
                  ) : (
                    <div key={item.label} className="flex flex-col items-start justify-start p-5 bg-[color:var(--bg-primary)]">{body}</div>
                  );
                })}
              </dl>

              <div className="mt-12 grid gap-10 md:grid-cols-2">
                <div>
                  <h3 className="text-[20px] mb-4">Needs attention</h3>
                  {stats.pendingComments === 0 && stats.unreadMessages === 0 ? (
                    <p className="text-[15px]">Nothing waiting. All comments are reviewed and the inbox is read.</p>
                  ) : (
                    <ul className="border-t border-[color:var(--line)]">
                      {stats.pendingComments > 0 && (
                        <li className="flex items-center justify-between gap-4 py-3 border-b border-[color:var(--line)] text-[15px]">
                          <span>{stats.pendingComments} comment{stats.pendingComments !== 1 && 's'} awaiting review</span>
                          <button type="button" onClick={() => { setCommentFilter('pending'); changeTab('comments'); }} className="text-link text-[14px]">Review</button>
                        </li>
                      )}
                      {stats.unreadMessages > 0 && (
                        <li className="flex items-center justify-between gap-4 py-3 border-b border-[color:var(--line)] text-[15px]">
                          <span>{stats.unreadMessages} unread message{stats.unreadMessages !== 1 && 's'}</span>
                          <button type="button" onClick={() => changeTab('inbox')} className="text-link text-[14px]">Open inbox</button>
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[20px]">System</h3>
                    <span className={`pill ${overview.system.isOnline ? 'pill-ok' : 'pill-danger'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
                      {overview.system.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <p className="text-[15px]">
                    Database: <span className="text-[color:var(--text-primary)]">{overview.system.databaseSizeKb.toLocaleString()} KB</span> of 500 MB
                  </p>
                  <div className="mt-3 h-1.5 rounded-full bg-[color:var(--bg-tertiary)] overflow-hidden" role="progressbar" aria-valuenow={Math.round(dbPercent)} aria-valuemin={0} aria-valuemax={100} aria-label="Database usage">
                    <div className="h-full rounded-full bg-[color:var(--text-primary)]" style={{ width: `${Math.max(1, dbPercent)}%` }} />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ========= POSTS ========= */}
          {tab === 'posts' && (
            <section aria-labelledby="posts-title">
              <PanelHeader
                id="posts-title"
                title={isFormOpen ? (isEditing ? 'Edit post' : 'New post') : 'Posts'}
                description={isFormOpen ? undefined : `${overview.posts.length} published`}
                action={
                  isFormOpen ? (
                    <button type="button" onClick={cancelEdit} className={btnGhost}>Close editor</button>
                  ) : (
                    <button type="button" onClick={() => { setPostForm(initialPostForm); setIsEditing(false); setIsFormOpen(true); }} className={btnPrimary}>
                      New post
                    </button>
                  )
                }
              />

              {isFormOpen && (
                <form onSubmit={handlePostSubmit} className="space-y-5 mb-14 pb-10 border-b border-[color:var(--line-strong)]">
                  <div className="grid md:grid-cols-2 gap-5">
                    <Field label="Title" htmlFor="post-title">
                      <input id="post-title" type="text" required value={postForm.title}
                        onChange={(e) => setPostForm((prev) => ({ ...prev, title: e.target.value }))} className="v-input" />
                    </Field>
                    <Field label="Slug" hint="Leave empty to generate from the title" htmlFor="post-slug">
                      <input id="post-slug" type="text" value={postForm.slug}
                        onChange={(e) => setPostForm((prev) => ({ ...prev, slug: e.target.value }))} className="v-input font-mono !text-[14px]" />
                    </Field>
                    <Field label="Category" htmlFor="post-category">
                      <input id="post-category" type="text" value={postForm.category}
                        onChange={(e) => setPostForm((prev) => ({ ...prev, category: e.target.value }))} className="v-input" />
                    </Field>
                    <Field label="Tags" hint="Comma separated" htmlFor="post-tags">
                      <input id="post-tags" type="text" value={postForm.tags}
                        onChange={(e) => setPostForm((prev) => ({ ...prev, tags: e.target.value }))} className="v-input" />
                    </Field>
                  </div>
                  <Field label="Cover image URL" hint="Optional" htmlFor="post-image">
                    <input id="post-image" type="url" value={postForm.imageUrl}
                      onChange={(e) => setPostForm((prev) => ({ ...prev, imageUrl: e.target.value }))} className="v-input" />
                  </Field>
                  <Field label="Excerpt" hint="Shown in the post list and search results" htmlFor="post-excerpt">
                    <textarea id="post-excerpt" rows={3} value={postForm.excerpt}
                      onChange={(e) => setPostForm((prev) => ({ ...prev, excerpt: e.target.value }))} className="v-input resize-y" />
                  </Field>
                  <Field label="Content" hint="Markdown or HTML" htmlFor="post-content">
                    <textarea id="post-content" rows={18} required value={postForm.content}
                      onChange={(e) => setPostForm((prev) => ({ ...prev, content: e.target.value }))} className="v-input resize-y font-mono !text-[14px] leading-relaxed" />
                  </Field>
                  <label className="flex items-center gap-2.5 text-[15px] cursor-pointer select-none">
                    <input type="checkbox" checked={postForm.commentsEnabled}
                      onChange={(e) => setPostForm((prev) => ({ ...prev, commentsEnabled: e.target.checked }))}
                      className="w-4 h-4 accent-[color:var(--text-primary)]" />
                    Allow comments on this post
                  </label>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button type="submit" disabled={submittingPost} className="btn-solid disabled:opacity-60">
                      {submittingPost ? 'Saving…' : isEditing ? 'Save changes' : 'Publish post'}
                    </button>
                    <button type="button" onClick={cancelEdit} className="btn-outline">Cancel</button>
                  </div>
                </form>
              )}

              {overview.posts.length === 0 ? (
                <EmptyState text="No posts yet. Write your first one with “New post”." />
              ) : (
                <ul className="border-t border-[color:var(--line)]">
                  {overview.posts.map((post) => (
                    <li key={post.id} className="py-5 border-b border-[color:var(--line)] grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                      <div className="min-w-0">
                        <h3 className="text-[19px] leading-snug truncate">{post.title}</h3>
                        <p className="mt-1 text-[13px] text-[color:var(--text-tertiary)] flex flex-wrap gap-x-3 gap-y-1">
                          <span className="font-mono truncate">/blog/{post.slug}</span>
                          <span>{post.views.toLocaleString()} views</span>
                          <span>{post.commentsCount} comments</span>
                          {!post.commentsEnabled && <span className="text-[color:var(--warn)]">Comments off</span>}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => startEditPost(post.id)} className={btnGhost}>Edit</button>
                        <button type="button" onClick={() => toggleCommentsStatus(post)} className={btnGhost}>
                          {post.commentsEnabled ? 'Turn comments off' : 'Turn comments on'}
                        </button>
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className={btnGhost}>View ↗</a>
                        <button type="button" onClick={() => deletePost(post.id)} className={btnDanger}>Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* ========= COMMENTS ========= */}
          {tab === 'comments' && (
            <section aria-labelledby="comments-title">
              <PanelHeader
                id="comments-title"
                title="Comments"
                description={`${stats.totalComments} total · ${stats.totalReplies} replies`}
                action={
                  <label className="flex items-center gap-2.5 text-[14px] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      disabled={updatingSettings}
                      checked={(overview.settings?.require_comment_approval ?? '1') === '1'}
                      onChange={(e) => updateSetting('require_comment_approval', e.target.checked ? '1' : '0')}
                      className="w-4 h-4 accent-[color:var(--text-primary)]"
                    />
                    Review comments before they appear
                  </label>
                }
              />

              {stats.pendingComments > 0 && (
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-[6px] border border-[color:color-mix(in_srgb,var(--warn)_40%,transparent)]">
                  <p className="text-[15px] text-[color:var(--warn)]">
                    {stats.pendingComments} comment{stats.pendingComments !== 1 && 's'} awaiting review
                  </p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => bulkAction('approve_all_pending')} disabled={bulkActioning} className={btnGhost}>Approve all</button>
                    <button type="button" onClick={() => bulkAction('delete_all_pending')} disabled={bulkActioning} className={btnDanger}>Delete all pending</button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-[color:var(--line)]">
                <div className="flex rounded-full border border-[color:var(--line-strong)] p-0.5" role="tablist" aria-label="Filter comments">
                  {([
                    ['pending', 'Pending', pendingCount],
                    ['approved', 'Approved', approvedCount],
                    ['all', 'All', overview.comments.length],
                  ] as const).map(([value, label, count]) => (
                    <button
                      key={value}
                      type="button"
                      role="tab"
                      aria-selected={commentFilter === value}
                      onClick={() => setCommentFilter(value)}
                      className={`px-3 py-1 rounded-full text-[13px] transition-colors ${
                        commentFilter === value
                          ? 'bg-[color:var(--text-primary)] text-[color:var(--bg-primary)]'
                          : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'
                      }`}
                    >
                      {label} <span className="tabular-nums opacity-70">{count}</span>
                    </button>
                  ))}
                </div>
                <select
                  aria-label="Filter by post"
                  value={selectedPostForComments}
                  onChange={(e) => setSelectedPostForComments(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className={`${selectClass} max-w-[240px]`}
                >
                  <option value="all">All posts</option>
                  {overview.posts.map(post => (
                    <option key={post.id} value={post.id}>{post.title}</option>
                  ))}
                </select>
                <select
                  aria-label="Sort comments"
                  value={commentSortOrder}
                  onChange={(e) => setCommentSortOrder(e.target.value as 'newest' | 'oldest')}
                  className={`${selectClass} ml-auto`}
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>

              {filteredComments.length === 0 ? (
                <div className="py-12">
                  <p className="text-[15px]">
                    {commentFilter === 'pending' && overview.comments.length > 0
                      ? 'All caught up. No comments waiting for review.'
                      : overview.comments.length === 0
                      ? 'No comments yet.'
                      : 'No comments match these filters.'}
                  </p>
                  {overview.comments.length > 0 && (commentFilter !== 'all' || selectedPostForComments !== 'all') && (
                    <button type="button" onClick={() => { setCommentFilter('all'); setSelectedPostForComments('all'); }} className="text-link mt-4 text-[14px]">
                      Show all comments
                    </button>
                  )}
                </div>
              ) : (
                <ul>
                  {filteredComments.map((comment) => (
                    <li key={comment.id} className="py-6 border-b border-[color:var(--line)]">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                            <span className="text-[15px] font-medium text-[color:var(--text-primary)]">{comment.name}</span>
                            <span className={`pill ${comment.isApproved ? 'pill-ok' : 'pill-warn'}`}>
                              {comment.isApproved ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                          <p className="mt-1 text-[13px] text-[color:var(--text-tertiary)] flex flex-wrap gap-x-2">
                            <span>on “{comment.blogTitle}”</span>
                            <span aria-hidden="true">·</span>
                            <FormattedDate date={comment.createdAt} options={{ day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }} />
                            {comment.email && (<><span aria-hidden="true">·</span><a href={`mailto:${comment.email}`} className="hover:text-[color:var(--text-primary)]">{comment.email}</a></>)}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button type="button" onClick={() => toggleCommentApproval(comment)} className={comment.isApproved ? btnGhost : btnPrimary}>
                            {comment.isApproved ? 'Unapprove' : 'Approve'}
                          </button>
                          <button type="button" onClick={() => deleteComment(comment.id)} className={btnDanger}>Delete</button>
                        </div>
                      </div>

                      <p className="mt-3 whitespace-pre-wrap text-[16px] max-w-3xl">{comment.content}</p>

                      {comment.replies.length > 0 && (
                        <ul className="mt-4 space-y-4 border-l border-[color:var(--line-strong)] pl-4 ml-1">
                          {comment.replies.map((reply) => (
                            <li key={reply.id} className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <p className="text-[14px] flex flex-wrap items-center gap-x-2 gap-y-1">
                                  <span className="font-medium text-[color:var(--text-primary)]">{reply.name}</span>
                                  {reply.isOwner && <span className="pill">Author</span>}
                                  <span className="text-[color:var(--text-muted)]">
                                    <FormattedDate date={reply.createdAt} options={{ day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }} />
                                  </span>
                                </p>
                                <p className="mt-1 whitespace-pre-wrap text-[15px]">{reply.content}</p>
                              </div>
                              <button type="button" onClick={() => deleteReply(reply.id)} className="text-[13px] text-[color:var(--text-muted)] hover:text-[color:var(--danger)] flex-shrink-0">
                                Delete
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-4 max-w-3xl">
                        <label htmlFor={`reply-${comment.id}`} className="sr-only">Reply to {comment.name}</label>
                        <textarea
                          id={`reply-${comment.id}`}
                          rows={2}
                          placeholder={`Reply to ${comment.name} as the author…`}
                          value={replyDrafts[comment.id] || ''}
                          onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                          className="v-input resize-y !text-[14px]"
                        />
                        {(replyDrafts[comment.id] || '').trim() && (
                          <div className="mt-2 flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={() => submitOwnerReply(comment.id)}
                              disabled={replyingToCommentId === comment.id}
                              className={btnPrimary}
                            >
                              {replyingToCommentId === comment.id ? 'Sending…' : comment.isApproved ? 'Send reply' : 'Approve and reply'}
                            </button>
                            {!comment.isApproved && (
                              <span className="text-[13px] text-[color:var(--text-tertiary)]">Replying also approves the comment.</span>
                            )}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* ========= INBOX ========= */}
          {tab === 'inbox' && (
            <section aria-labelledby="inbox-title">
              <PanelHeader
                id="inbox-title"
                title="Inbox"
                description={`${stats.totalMessages} message${stats.totalMessages !== 1 ? 's' : ''}${stats.unreadMessages ? ` · ${stats.unreadMessages} unread` : ''}`}
              />
              {overview.messages.length === 0 ? (
                <EmptyState text="No messages yet. Anything sent through the contact form will appear here." />
              ) : (
                <ul className="border-t border-[color:var(--line)]">
                  {overview.messages.map((msg) => (
                    <li key={msg.id} className={`py-6 border-b border-[color:var(--line)] ${msg.isRead ? '' : 'relative'}`}>
                      {!msg.isRead && (
                        <span className="absolute -left-4 top-8 w-1.5 h-1.5 rounded-full bg-[color:var(--text-primary)]" aria-label="Unread" />
                      )}
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="pill">{MESSAGE_TYPE_LABELS[msg.type || ''] || msg.type || 'General'}</span>
                            <span className="text-[13px] text-[color:var(--text-muted)]">
                              <FormattedDate date={msg.createdAt} options={{ day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }} />
                            </span>
                          </div>
                          <h3 className={`text-[19px] leading-snug break-words ${msg.isRead ? 'text-[color:var(--text-secondary)]' : ''}`}>
                            {msg.subject || 'No subject'}
                          </h3>
                          <p className="mt-1 text-[14px] text-[color:var(--text-tertiary)] break-all">
                            {msg.name} · {msg.email}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 flex-shrink-0">
                          <a
                            href={`mailto:${msg.email}?subject=${encodeURIComponent(`Re: ${msg.subject || 'Your message'}`)}`}
                            className={btnPrimary}
                          >
                            Reply by email
                          </a>
                          <button type="button" onClick={() => toggleMessageRead(msg)} className={btnGhost}>
                            {msg.isRead ? 'Mark unread' : 'Mark read'}
                          </button>
                          <button type="button" onClick={() => deleteMessage(msg.id)} className={btnDanger}>Delete</button>
                        </div>
                      </div>
                      <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed max-w-3xl pl-4 border-l border-[color:var(--line-strong)]">
                        {msg.message}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* ========= MUSIC ========= */}
          {tab === 'music' && (
            <section aria-labelledby="music-title">
              <PanelHeader
                id="music-title"
                title="Music videos"
                description={`${overview.videos.length} on the Music page`}
                action={
                  <button type="button" onClick={() => setIsVideoFormOpen(!isVideoFormOpen)} className={isVideoFormOpen ? btnGhost : btnPrimary}>
                    {isVideoFormOpen ? 'Close' : 'Add video'}
                  </button>
                }
              />

              {isVideoFormOpen && (
                <form onSubmit={handleVideoSubmit} className="space-y-5 mb-12 pb-10 border-b border-[color:var(--line-strong)]">
                  <div className="grid md:grid-cols-2 gap-5">
                    <Field label="Song title" htmlFor="video-title">
                      <input id="video-title" type="text" required value={videoForm.title}
                        onChange={(e) => setVideoForm((prev) => ({ ...prev, title: e.target.value }))} className="v-input" />
                    </Field>
                    <Field label="YouTube URL" htmlFor="video-url">
                      <input id="video-url" type="url" required value={videoForm.videoUrl} placeholder="https://youtube.com/watch?v=…"
                        onChange={(e) => setVideoForm((prev) => ({ ...prev, videoUrl: e.target.value }))} className="v-input" />
                    </Field>
                  </div>
                  <Field label="Description" hint="Optional" htmlFor="video-description">
                    <textarea id="video-description" rows={3} value={videoForm.description}
                      onChange={(e) => setVideoForm((prev) => ({ ...prev, description: e.target.value }))} className="v-input resize-y" />
                  </Field>
                  <button type="submit" disabled={submittingVideo} className="btn-solid disabled:opacity-60">
                    {submittingVideo ? 'Adding…' : 'Add video'}
                  </button>
                </form>
              )}

              {overview.videos.length === 0 ? (
                <EmptyState text="No videos yet. Added videos appear on the public Music page." />
              ) : (
                <ul className="border-t border-[color:var(--line)]">
                  {overview.videos.map((video) => (
                    <li key={video.id} className="py-4 border-b border-[color:var(--line)] flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-28 aspect-video bg-black rounded-[4px] overflow-hidden flex-shrink-0 relative">
                          <Image src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} alt="" fill sizes="112px" className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[17px] leading-snug truncate">{video.title}</h3>
                          <p className="mt-1 text-[13px] text-[color:var(--text-tertiary)]">
                            {(video.plays || 0).toLocaleString()} plays · <span className="font-mono">{video.youtubeId}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a href={`https://youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer" className={btnGhost}>YouTube ↗</a>
                        <button type="button" onClick={() => deleteVideo(video.id)} className={btnDanger}>Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* ========= ADMINS ========= */}
          {tab === 'users' && session?.isSuperAdmin && (
            <section aria-labelledby="users-title">
              <PanelHeader
                id="users-title"
                title={editingUserEmail ? 'Edit admin' : 'Admins'}
                description={editingUserEmail ? editingUserEmail : 'People who can sign in to this dashboard.'}
                action={
                  isUserFormOpen ? (
                    <button type="button" onClick={cancelUserEdit} className={btnGhost}>Cancel</button>
                  ) : (
                    <button type="button" onClick={() => { setUserForm(initialUserForm); setEditingUserEmail(null); setIsUserFormOpen(true); }} className={btnPrimary}>
                      Add admin
                    </button>
                  )
                }
              />

              {isUserFormOpen && (
                <form onSubmit={handleUserSubmit} className="space-y-5 mb-12 pb-10 border-b border-[color:var(--line-strong)]">
                  <div className="grid md:grid-cols-3 gap-5">
                    <Field label="Name" htmlFor="user-name">
                      <input id="user-name" type="text" value={userForm.name} autoComplete="off"
                        onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))} className="v-input" />
                    </Field>
                    <Field label="Email" htmlFor="user-email">
                      <input id="user-email" type="email" required disabled={!!editingUserEmail} value={userForm.email} autoComplete="off"
                        onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))} className="v-input disabled:opacity-60" />
                    </Field>
                    <Field label={editingUserEmail ? 'New password' : 'Password'} hint={editingUserEmail ? 'Leave empty to keep the current one' : undefined} htmlFor="user-password">
                      <input id="user-password" type="password" required={!editingUserEmail} value={userForm.password} autoComplete="new-password"
                        onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))} className="v-input" />
                    </Field>
                  </div>
                  <button type="submit" disabled={submittingUser} className="btn-solid disabled:opacity-60">
                    {submittingUser ? 'Saving…' : editingUserEmail ? 'Save changes' : 'Create admin'}
                  </button>
                </form>
              )}

              {users.length === 0 ? (
                <EmptyState text="Only the admin configured on the server can sign in." />
              ) : (
                <ul className="border-t border-[color:var(--line)]">
                  {users.map((user) => (
                    <li key={user.email} className="py-4 border-b border-[color:var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-[17px]">{user.name || 'Admin'}</h3>
                        <p className="text-[13px] text-[color:var(--text-tertiary)] break-all">
                          {user.email} · added <FormattedDate date={user.createdAt} options={{ day: 'numeric', month: 'short', year: 'numeric' }} />
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => startEditUser(user)} className={btnGhost}>Edit</button>
                        <button type="button" onClick={() => deleteUser(user.email)} className={btnDanger}>Remove</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function PanelHeader({ id, title, description, action }: { id: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h2 id={id} className="text-[30px] leading-tight tracking-[-0.02em]">{title}</h2>
        {description && <p className="mt-1 text-[14px] text-[color:var(--text-tertiary)]">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function Field({ label, hint, htmlFor, children }: { label: string; hint?: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="v-label">
        {label}
        {hint && <span className="ml-2 font-normal text-[color:var(--text-muted)]">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="py-10 text-[15px] text-[color:var(--text-tertiary)] border-t border-[color:var(--line)]">{text}</p>;
}
