'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { BlogReply, BlogSummary } from '@/types/blog';
import { 
  LayoutDashboard, FileText, MessageSquare, 
  Eye, CheckCircle, Trash2, Edit3, Globe, 
  LogOut, PlusCircle, Reply, PowerOff, ShieldCheck, X,
  Play, ChevronDown, Filter, Mail, Inbox, Users
} from 'lucide-react';
import { Icons } from '@/components/common/Icons';
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

export default function AdminDashboardPage() {
  const router = useRouter();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
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

  const [videoForm, setVideoForm] = useState<VideoFormState>(initialVideoForm);
  const [submittingVideo, setSubmittingVideo] = useState(false);
  const [isVideoFormOpen, setIsVideoFormOpen] = useState(false);

  const [userForm, setUserForm] = useState<UserFormState>(initialUserForm);
  const [submittingUser, setSubmittingUser] = useState(false);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUserEmail, setEditingUserEmail] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/users');
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

    const url = isEditing ? `/api/admin/posts/${postForm.id}` : '/api/admin/posts';
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
      const response = await fetch('/api/admin/music-videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videoForm),
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
      const response = await fetch('/api/admin/users', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm),
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelUserEdit = () => {
    setUserForm(initialUserForm);
    setEditingUserEmail(null);
    setIsUserFormOpen(false);
  };

  const deleteUser = async (email: string) => {
    if (!window.confirm(`Delete user ${email}?`)) return;

    try {
      const response = await fetch(`/api/admin/users?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
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

    const response = await fetch(`/api/admin/music-videos/${videoId}`, {
      method: 'DELETE',
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
          const response = await fetch(`/api/admin/posts/${postId}`);
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
          window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const toggleMessageRead = async (message: AdminMessage) => {
    const response = await fetch(`/api/admin/messages/${message.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isRead: !message.isRead,
      }),
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

    const response = await fetch(`/api/admin/messages/${messageId}`, {
      method: 'DELETE',
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
    <section className="section-container pt-24 md:pt-32 pb-24">
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-full">
            <LayoutDashboard size={28} className="md:w-8 md:h-8" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-muted mb-1">Admin Control Center</p>
            <h1 className="text-3xl md:text-4xl font-black">Dashboard</h1>
          </div>
        </div>

        <div className="flex flex-row w-full md:w-auto gap-2 md:gap-3 items-center">
          <Link
            href="/blog"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-light hover:border-brand-orange hover:text-brand-orange px-3 md:px-4 py-2.5 rounded-sm text-xs md:text-sm font-bold uppercase tracking-wider transition-colors"
          >
            <Globe size={14} className="md:w-4 md:h-4" />
            View Live
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 md:px-4 py-2.5 rounded-sm text-xs md:text-sm font-bold uppercase tracking-wider transition-colors"
          >
            <PowerOff size={14} className="md:w-4 md:h-4" />
            Logout
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-sm flex items-center justify-between gap-3 text-green-700">
          <div className="flex items-center gap-3">
              <CheckCircle size={20} />
              <p className="text-sm font-bold">{actionMessage}</p>
          </div>
          <button onClick={() => setActionMessage('')}><X size={16}/></button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
        <div className="border border-light/60 shadow-sm rounded-xl p-4 md:p-6 bg-tertiary flex flex-col md:flex-row items-center md:justify-between gap-3 md:gap-0 group hover:border-brand-orange/40 transition-colors text-center md:text-left">
          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-wider text-muted font-bold">Posts</p>
            <p className="text-2xl md:text-4xl font-black mt-1 md:mt-2 text-primary">{overview.stats.totalPosts}</p>
          </div>
          <div className="p-3 md:p-4 bg-brand-orange/10 rounded-full text-brand-orange group-hover:scale-110 transition-transform">
            <Edit3 size={20} className="md:w-6 md:h-6" />
          </div>
        </div>

        <button 
          onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="border border-light/60 shadow-sm rounded-xl p-4 md:p-6 bg-tertiary flex flex-col md:flex-row items-center md:justify-between gap-3 md:gap-0 group hover:border-brand-orange/40 transition-colors text-center md:text-left cursor-pointer"
        >
          <div>
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
              <p className="text-[10px] md:text-xs uppercase tracking-wider text-muted font-bold">Comments</p>
              {overview.stats.pendingComments > 0 && (
                <span className="text-[9px] md:text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold">
                  {overview.stats.pendingComments}
                </span>
              )}
            </div>
            <p className="text-2xl md:text-4xl font-black mt-1 md:mt-2 text-primary">{overview.stats.totalComments}</p>
          </div>
          <div className="p-3 md:p-4 bg-blue-500/10 rounded-full text-blue-500 group-hover:scale-110 transition-transform">
            <MessageSquare size={20} className="md:w-6 md:h-6" />
          </div>
        </button>

        <div className="border border-light/60 shadow-sm rounded-xl p-4 md:p-6 bg-tertiary flex flex-col md:flex-row items-center md:justify-between gap-3 md:gap-0 group hover:border-brand-orange/40 transition-colors text-center md:text-left">
          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-wider text-muted font-bold">Views</p>
            <p className="text-2xl md:text-4xl font-black mt-1 md:mt-2 text-primary">{overview.stats.totalBlogViews}</p>
          </div>
          <div className="p-3 md:p-4 bg-green-500/10 rounded-full text-green-500 group-hover:scale-110 transition-transform">
            <Eye size={20} className="md:w-6 md:h-6" />
          </div>
        </div>

        <div className="border border-light/60 shadow-sm rounded-xl p-4 md:p-6 bg-tertiary flex flex-col md:flex-row items-center md:justify-between gap-3 md:gap-0 group hover:border-brand-orange/40 transition-colors text-center md:text-left">
          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-wider text-muted font-bold">Videos</p>
            <p className="text-2xl md:text-4xl font-black mt-1 md:mt-2 text-primary">{overview.stats.totalVideos}</p>
          </div>
          <div className="p-3 md:p-4 bg-red-500/10 rounded-full text-red-500 group-hover:scale-110 transition-transform">
            <Icons.YouTube className="w-5 h-5 md:w-6 md:h-6" />
          </div>
        </div>

        <button 
          onClick={() => document.getElementById('inbox-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="border border-light/60 shadow-sm rounded-xl p-4 md:p-6 bg-tertiary flex flex-col md:flex-row items-center md:justify-between gap-3 md:gap-0 group hover:border-brand-orange/40 transition-colors text-center md:text-left cursor-pointer"
        >
          <div>
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
              <p className="text-[10px] md:text-xs uppercase tracking-wider text-muted font-bold">Inbox</p>
              {overview.stats.unreadMessages > 0 && (
                <span className="text-[9px] md:text-[10px] bg-brand-orange text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                  {overview.stats.unreadMessages} NEW
                </span>
              )}
            </div>
            <p className="text-2xl md:text-4xl font-black mt-1 md:mt-2 text-primary">{overview.stats.totalMessages}</p>
          </div>
          <div className="p-3 md:p-4 bg-orange-500/10 rounded-full text-brand-orange group-hover:scale-110 transition-transform">
            <Inbox size={20} className="md:w-6 md:h-6" />
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
        <div className="border border-light/60 shadow-sm rounded-xl p-5 md:p-6 bg-tertiary">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-muted flex items-center gap-2">
              <ShieldCheck size={16} className="text-brand-orange" />
              System
            </h3>
            {overview.system.isOnline ? (
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 md:py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Online
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 md:py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                Offline
              </span>
            )}
          </div>
          <p className="text-xl md:text-2xl font-black">{overview.system.databaseSizeKb} KB <span className="text-xs md:text-sm text-secondary font-medium">Used Space</span></p>
          <div className="w-full bg-light h-1.5 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-brand-orange h-full rounded-full transition-all" 
              style={{ width: `${Math.max(1, (overview.system.databaseSizeKb / 512000) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="border border-light/60 shadow-sm rounded-xl p-5 md:p-6 bg-tertiary">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-muted flex items-center gap-2">
              <Globe size={16} className="text-blue-500" />
              Audience
            </h3>
          </div>
          <div className="flex gap-6 md:gap-8">
            <div>
              <p className="text-2xl md:text-4xl font-black">{overview.stats.totalSubscribers}</p>
              <p className="text-[10px] md:text-sm text-secondary font-medium mt-1 uppercase tracking-tighter md:tracking-normal">Push Subs</p>
            </div>
            <div>
              <p className="text-2xl md:text-4xl font-black">{overview.stats.totalPageViews}</p>
              <p className="text-[10px] md:text-sm text-secondary font-medium mt-1 uppercase tracking-tighter md:tracking-normal">Visitors</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-light/60 shadow-sm rounded-xl p-5 md:p-8 bg-tertiary mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <PlusCircle className="text-brand-orange" />
            <h2 className="text-xl md:text-2xl font-black">{isEditing ? 'Edit Post' : 'New Post'}</h2>
          </div>
          <div className="flex gap-2">
              {isEditing && (
                  <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 sm:flex-none bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-3 md:px-4 py-2 rounded-sm text-[10px] md:text-sm font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="flex-1 sm:flex-none border border-light hover:border-brand-orange hover:text-brand-orange px-3 md:px-4 py-2 rounded-sm text-[10px] md:text-sm font-bold uppercase tracking-wider transition-colors"
              >
                {isFormOpen ? 'Hide' : (isEditing ? 'Editor' : 'Create')}
              </button>
          </div>
        </div>
        {isFormOpen && (
        <form onSubmit={handlePostSubmit} className="mt-6 space-y-4">
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
            type="text"
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
            rows={15}
            required
            placeholder="Full post content (Markdown or HTML)"
            value={postForm.content}
            onChange={(event) => setPostForm((prev) => ({ ...prev, content: event.target.value }))}
            className="w-full border border-light rounded-sm px-4 py-3 bg-background font-mono text-sm"
          />

          <label className="inline-flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={postForm.commentsEnabled}
              onChange={(event) => setPostForm((prev) => ({ ...prev, commentsEnabled: event.target.checked }))}
            />
            Enable comments for this post
          </label>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submittingPost}
              className="bg-brand-orange hover:bg-orange-700 disabled:opacity-60 text-white px-6 py-3 rounded-sm font-bold uppercase tracking-wider text-sm flex items-center gap-2"
            >
              {submittingPost ? 'Saving...' : (isEditing ? 'Update Post' : 'Publish Post')}
            </button>
            {isEditing && (
                <button
                    type="button"
                    onClick={cancelEdit}
                    className="border border-light hover:bg-zinc-100 px-6 py-3 rounded-sm font-bold uppercase tracking-wider text-sm"
                >
                    Cancel Edit
                </button>
            )}
          </div>
        </form>
        )}
      </div>

      <div className="border border-light/60 shadow-sm rounded-xl p-5 md:p-8 bg-tertiary mb-12">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="text-brand-orange" />
          <h2 className="text-xl md:text-2xl font-black">Manage Posts</h2>
        </div>
        <div className="mt-6 space-y-4">
          {overview.posts.map((post) => (
            <div key={post.id} className="border border-light rounded-sm p-4 bg-background hover:border-brand-orange/30 transition-colors">
              <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-black">{post.title}</h3>
                  <p className="text-xs md:text-sm text-secondary mt-1">
                    /blog/{post.slug} • {post.views} views • {post.commentsCount} comments
                  </p>
                </div>
                <div className="flex flex-wrap w-full md:w-auto gap-2">
                  <button
                    type="button"
                    onClick={() => startEditPost(post.id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1 border border-light hover:border-blue-500 hover:text-blue-500 px-3 py-2 rounded-sm text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <Edit3 size={12} className="md:w-3.5 md:h-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCommentsStatus(post)}
                    className="flex-1 md:flex-none border border-light hover:border-brand-orange px-3 py-2 rounded-sm text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    {post.commentsEnabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePost(post.id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-2 rounded-sm text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <Trash2 size={12} className="md:w-3.5 md:h-3.5" />
                    Delete
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

      <div className="border border-light/60 shadow-sm rounded-xl p-5 md:p-8 bg-tertiary mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Icons.YouTube className="text-red-500 w-6 h-6" />
            <h2 className="text-xl md:text-2xl font-black">Add Music Video</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsVideoFormOpen(!isVideoFormOpen)}
            className="flex-1 sm:flex-none border border-light hover:border-brand-orange hover:text-brand-orange px-3 md:px-4 py-2 rounded-sm text-[10px] md:text-sm font-bold uppercase tracking-wider transition-colors"
          >
            {isVideoFormOpen ? 'Hide' : 'Add Video'}
          </button>
        </div>
        {isVideoFormOpen && (
        <form onSubmit={handleVideoSubmit} className="mt-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Song Title"
              required
              value={videoForm.title}
              onChange={(event) => setVideoForm((prev) => ({ ...prev, title: event.target.value }))}
              className="w-full border border-light rounded-sm px-4 py-3 bg-background"
            />
            <input
              type="text"
              placeholder="YouTube URL"
              required
              value={videoForm.videoUrl}
              onChange={(event) => setVideoForm((prev) => ({ ...prev, videoUrl: event.target.value }))}
              className="w-full border border-light rounded-sm px-4 py-3 bg-background"
            />
          </div>
          <textarea
            rows={3}
            placeholder="Description (optional)"
            value={videoForm.description}
            onChange={(event) => setVideoForm((prev) => ({ ...prev, description: event.target.value }))}
            className="w-full border border-light rounded-sm px-4 py-3 bg-background"
          />
          <button
            type="submit"
            disabled={submittingVideo}
            className="w-full sm:w-auto bg-brand-orange hover:bg-orange-700 disabled:opacity-60 text-white px-6 py-3 rounded-sm font-bold uppercase tracking-wider text-xs md:text-sm flex items-center justify-center gap-2"
          >
            <PlusCircle size={18} />
            {submittingVideo ? 'Adding...' : 'Add Video'}
          </button>
        </form>
        )}
      </div>

      <div className="border border-light/60 shadow-sm rounded-xl p-5 md:p-8 bg-tertiary mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Play className="text-brand-orange" size={24} />
          <h2 className="text-xl md:text-2xl font-black">Manage Music Videos</h2>
        </div>
        <div className="mt-6 space-y-4">
          {overview.videos.map((video) => (
            <div key={video.id} className="border border-light rounded-sm p-4 bg-background hover:border-brand-orange/30 transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
                  <div className="w-20 md:w-24 aspect-video bg-zinc-100 rounded-sm overflow-hidden flex-shrink-0 relative group">
                    <img 
                      src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icons.YouTube className="text-white w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm md:text-lg font-bold truncate">{video.title}</h3>
                    <p className="text-[10px] md:text-xs text-muted font-medium mt-0.5 truncate">
                      ID: {video.youtubeId} • Added <FormattedDate date={video.publishedAt} options={{ day: '2-digit', month: 'short', year: 'numeric' }} />
                    </p>
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-brand-orange mt-1 bg-brand-orange/5 inline-block px-2 py-0.5 rounded-full">
                      {video.plays || 0} plays
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <a 
                    href={`https://youtube.com/watch?v=${video.youtubeId}`} 
                    target="_blank" 
                    className="flex-1 sm:flex-none flex items-center justify-center p-2 border border-light hover:border-brand-orange hover:text-brand-orange rounded-sm transition-colors"
                  >
                    <Globe size={18} />
                  </a>
                  <button
                    type="button"
                    onClick={() => deleteVideo(video.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-sm transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {overview.videos.length === 0 && (
            <p className="text-muted">No music videos added yet.</p>
          )}
        </div>
        </div>

      <div className="border border-light/60 shadow-sm rounded-xl p-5 md:p-8 bg-tertiary mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Users className="text-brand-orange" />
            <h2 className="text-xl md:text-2xl font-black">{editingUserEmail ? 'Edit User' : 'User Management'}</h2>
          </div>
          <div className="flex gap-2">
            {editingUserEmail && (
              <button
                type="button"
                onClick={cancelUserEdit}
                className="flex-1 sm:flex-none bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-3 md:px-4 py-2 rounded-sm text-[10px] md:text-sm font-bold uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsUserFormOpen(!isUserFormOpen)}
              className="flex-1 sm:flex-none border border-light hover:border-brand-orange hover:text-brand-orange px-3 md:px-4 py-2 rounded-sm text-[10px] md:text-sm font-bold uppercase tracking-wider transition-colors"
            >
              {isUserFormOpen ? 'Hide' : (editingUserEmail ? 'Editor' : 'Add User')}
            </button>
          </div>
        </div>

        {isUserFormOpen && (
          <form onSubmit={handleUserSubmit} className="mt-6 space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={userForm.name}
                onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-light rounded-sm px-4 py-3 bg-background"
              />
              <input
                type="email"
                placeholder="Email"
                required
                disabled={!!editingUserEmail}
                value={userForm.email}
                onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full border border-light rounded-sm px-4 py-3 bg-background disabled:opacity-60"
              />
              <input
                type="password"
                placeholder={editingUserEmail ? "New Password (optional)" : "Password"}
                required={!editingUserEmail}
                value={userForm.password}
                onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full border border-light rounded-sm px-4 py-3 bg-background"
              />
            </div>
            <button
              type="submit"
              disabled={submittingUser}
              className="w-full sm:w-auto bg-brand-orange hover:bg-orange-700 disabled:opacity-60 text-white px-6 py-3 rounded-sm font-bold uppercase tracking-wider text-xs md:text-sm flex items-center justify-center gap-2"
            >
              <PlusCircle size={18} />
              {submittingUser ? 'Saving...' : (editingUserEmail ? 'Update Admin' : 'Create Admin')}
            </button>
          </form>
        )}

        <div className="mt-8 space-y-4">
          {users.map((user) => (
            <div key={user.email} className="border border-light rounded-sm p-4 bg-background flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg">{user.name || 'Admin'}</h3>
                <p className="text-sm text-secondary">{user.email}</p>
                <p className="text-[10px] text-muted font-medium mt-1 uppercase tracking-widest">
                  Joined <FormattedDate date={user.createdAt} options={{ day: '2-digit', month: 'short', year: 'numeric' }} />
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => startEditUser(user)}
                  className="flex-1 sm:flex-none flex items-center justify-center p-2 border border-light hover:border-blue-500 hover:text-blue-500 rounded-sm transition-colors"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => deleteUser(user.email)}
                  className="flex-1 sm:flex-none flex items-center justify-center p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-sm transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <p className="text-muted italic">Only environment-configured admin available.</p>
          )}
        </div>
        </div>

        <div id="comments-section"
 className="border border-light/60 shadow-sm rounded-xl p-5 md:p-8 bg-tertiary">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-brand-orange" />
            <h2 className="text-xl md:text-2xl font-black">Comments Moderation</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 bg-background border border-light rounded-sm px-3 py-2">
              <Filter size={14} className="text-muted" />
              <select 
                value={selectedPostForComments} 
                onChange={(e) => setSelectedPostForComments(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="flex-1 bg-transparent text-[10px] md:text-xs font-bold uppercase tracking-wider outline-none cursor-pointer min-w-0"
              >
                <option value="all">All Posts</option>
                {overview.posts.map(post => (
                  <option key={post.id} value={post.id}>{post.title}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-background border border-light rounded-sm px-3 py-2">
              <select 
                value={commentSortOrder} 
                onChange={(e) => setCommentSortOrder(e.target.value as 'newest' | 'oldest')}
                className="flex-1 bg-transparent text-[10px] md:text-xs font-bold uppercase tracking-wider outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {overview.comments
            .filter(c => selectedPostForComments === 'all' || c.blogId === selectedPostForComments)
            .sort((a, b) => {
              const timeA = new Date(a.createdAt).getTime();
              const timeB = new Date(b.createdAt).getTime();
              return commentSortOrder === 'newest' ? timeB - timeA : timeA - timeB;
            })
            .map((comment) => (
            <div key={comment.id} className="border border-light rounded-sm p-4 md:p-5 bg-background shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted font-bold">
                    {comment.blogTitle}
                  </p>
                  <h3 className="text-base md:text-lg font-bold mt-1">{comment.name}</h3>
                  {comment.email && (
                    <p className="text-xs md:text-sm text-secondary truncate max-w-[250px]">{comment.email}</p>
                  )}
                  <p className="text-xs text-muted mt-1"><FormattedDate date={comment.createdAt} options={{ day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }} /></p>
                </div>

                <div className="flex flex-row md:flex-wrap w-full md:w-auto gap-2">
                  <button
                    type="button"
                    onClick={() => toggleCommentApproval(comment)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1 border border-light hover:border-brand-orange px-3 py-2 rounded-sm text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <ShieldCheck size={12} className="md:w-3.5 md:h-3.5" />
                    {comment.isApproved ? 'Unapprove' : 'Approve'}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteComment(comment.id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-transparent px-3 py-2 rounded-sm text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <Trash2 size={12} className="md:w-3.5 md:h-3.5" />
                    Delete
                  </button>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm md:text-base leading-relaxed">{comment.content}</p>

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
                        <p className="text-xs text-muted mt-2"><FormattedDate date={reply.createdAt} options={{ day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }} /></p>
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

          {overview.comments.length > 0 && overview.comments.filter(c => selectedPostForComments === 'all' || c.blogId === selectedPostForComments).length === 0 && (
            <div className="text-center py-10 bg-background rounded-sm border border-dashed border-light">
              <p className="text-muted font-medium italic">No comments found for this specific post.</p>
              <button 
                onClick={() => setSelectedPostForComments('all')}
                className="mt-4 text-xs font-bold uppercase tracking-widest text-brand-orange hover:underline"
              >
                Show all comments
              </button>
            </div>
          )}
        </div>
      </div>

      <div id="inbox-section" className="border border-light/60 shadow-sm rounded-xl p-5 md:p-8 bg-tertiary mt-12">
        <div className="flex items-center gap-3 mb-8">
          <Mail className="text-brand-orange" />
          <h2 className="text-xl md:text-2xl font-black">Inquiries Inbox</h2>
        </div>

        <div className="space-y-4">
          {overview.messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`border rounded-sm p-4 md:p-6 transition-all ${
                msg.isRead 
                ? 'bg-background border-light opacity-80' 
                : 'bg-white border-brand-orange shadow-md border-l-4'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      msg.type === 'SONG' ? 'bg-pink-100 text-pink-700' :
                      msg.type === 'PROJECT' ? 'bg-blue-100 text-blue-700' :
                      msg.type === 'ROM' ? 'bg-purple-100 text-purple-700' :
                      'bg-zinc-100 text-zinc-700'
                    }`}>
                      {msg.type || 'General'}
                    </span>
                    {!msg.isRead && (
                      <span className="text-[9px] font-black bg-brand-orange text-white px-2 py-0.5 rounded-full uppercase">New</span>
                    )}
                    <span className="text-[10px] text-muted font-bold">
                      <FormattedDate date={msg.createdAt} options={{ day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }} />
                    </span>
                  </div>
                  <h3 className="font-bold text-lg">{msg.subject || 'No Subject'}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <p className="text-xs font-bold text-brand-orange">{msg.name}</p>
                    <p className="text-xs text-secondary">{msg.email}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={() => toggleMessageRead(msg)}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest border transition-colors ${
                      msg.isRead 
                      ? 'border-light hover:border-brand-orange text-secondary' 
                      : 'bg-brand-orange border-brand-orange text-white'
                    }`}
                  >
                    {msg.isRead ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="flex-1 md:flex-none flex items-center justify-center p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-sm transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-zinc-50 rounded-sm border border-light/40">
                <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed italic text-secondary">
                  &quot;{msg.message}&quot;
                </p>
              </div>
              
              <div className="mt-4">
                <a 
                  href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Your inquiry'}`}
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-orange hover:underline"
                >
                  <Reply size={14} />
                  Reply via Email
                </a>
              </div>
            </div>
          ))}
          
          {overview.messages.length === 0 && (
            <div className="text-center py-12 border border-dashed border-light rounded-sm">
              <Mail className="mx-auto text-muted mb-3" size={32} />
              <p className="text-muted font-medium italic">Your inbox is empty.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
