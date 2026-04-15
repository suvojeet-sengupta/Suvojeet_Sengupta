import { NextResponse } from 'next/server';
import { isAdminRequestAuthenticated } from '@/lib/admin-auth';
import { getDb } from '@/lib/cloudflare';
import { mapBlogSummary, toBoolean } from '@/lib/blog-utils';
import type { BlogReply } from '@/types/blog';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface AdminCommentRow {
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

export async function GET(request: Request) {
  const authenticated = await isAdminRequestAuthenticated(request);
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  
  // Ensure tables exist natively via edge execution
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint TEXT NOT NULL UNIQUE,
        p256dh TEXT NOT NULL,
        auth TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
  } catch (e) {
    console.error('Migration error:', e);
  }

  // Determine system health by capturing exact size
  let databaseSizeBytes = 0;
  try {
    const pageCount = await db.prepare('PRAGMA page_count').first<{page_count: number}>();
    const pageSize = await db.prepare('PRAGMA page_size').first<{page_size: number}>();
    if (pageCount && pageSize) {
      databaseSizeBytes = (pageCount.page_count || 0) * (pageSize.page_size || 0);
    }
  } catch (e) {
    console.error('Pragma error:', e);
  }

  const statsRow = await db
    .prepare(`
      SELECT
        (SELECT COUNT(*) FROM blogs) AS total_posts,
        (SELECT COUNT(*) FROM comments) AS total_comments,
        (SELECT COUNT(*) FROM comments WHERE is_approved = 0) AS pending_comments,
        (SELECT COUNT(*) FROM replies) AS total_replies,
        (SELECT COALESCE(SUM(views), 0) FROM blogs) AS total_blog_views,
        (SELECT COUNT(*) FROM page_views) AS total_page_views,
        (SELECT COUNT(*) FROM push_subscriptions) AS total_subscribers
    `)
    .first<Record<string, unknown>>();

  const postsResult = await db
    .prepare(`
      SELECT
        b.id,
        b.title,
        b.slug,
        b.excerpt,
        b.category,
        b.image_url,
        b.published_at,
        b.views,
        b.author,
        b.tags,
        b.comments_enabled,
        (
          SELECT COUNT(*)
          FROM comments c
          WHERE c.blog_id = b.id
        ) AS comments_count
      FROM blogs b
      ORDER BY datetime(b.published_at) DESC
    `)
    .all<Record<string, unknown>>();

  const commentsResult = await db
    .prepare(`
      SELECT
        c.id,
        c.blog_id,
        c.name,
        c.email,
        c.content,
        c.is_approved,
        c.created_at,
        b.title AS blog_title
      FROM comments c
      INNER JOIN blogs b ON b.id = c.blog_id
      ORDER BY datetime(c.created_at) DESC
      LIMIT 100
    `)
    .all<Record<string, unknown>>();

  const commentIds = commentsResult.results.map((row) => Number(row.id || 0)).filter(Boolean);
  const repliesByComment = new Map<number, BlogReply[]>();

  if (commentIds.length > 0) {
    const placeholders = commentIds.map(() => '?').join(', ');
    const repliesResult = await db
      .prepare(`
        SELECT
          id,
          comment_id,
          name,
          content,
          is_owner,
          created_at
        FROM replies
        WHERE comment_id IN (${placeholders})
        ORDER BY datetime(created_at) ASC
      `)
      .bind(...commentIds)
      .all<Record<string, unknown>>();

    for (const row of repliesResult.results) {
      const commentId = Number(row.comment_id || 0);
      const mappedReply: BlogReply = {
        id: Number(row.id || 0),
        commentId,
        name: String(row.name || ''),
        content: String(row.content || ''),
        isOwner: toBoolean(row.is_owner),
        createdAt: String(row.created_at || ''),
      };

      const list = repliesByComment.get(commentId) || [];
      list.push(mappedReply);
      repliesByComment.set(commentId, list);
    }
  }

  const comments: AdminCommentRow[] = commentsResult.results.map((row) => {
    const commentId = Number(row.id || 0);
    return {
      id: commentId,
      blogId: Number(row.blog_id || 0),
      blogTitle: String(row.blog_title || ''),
      name: String(row.name || ''),
      email: typeof row.email === 'string' ? row.email : null,
      content: String(row.content || ''),
      isApproved: toBoolean(row.is_approved),
      createdAt: String(row.created_at || ''),
      replies: repliesByComment.get(commentId) || [],
    };
  });

  const posts = postsResult.results.map((row) => mapBlogSummary(row));

  return NextResponse.json({
    stats: {
      totalPosts: Number(statsRow?.total_posts || 0),
      totalComments: Number(statsRow?.total_comments || 0),
      pendingComments: Number(statsRow?.pending_comments || 0),
      totalReplies: Number(statsRow?.total_replies || 0),
      totalBlogViews: Number(statsRow?.total_blog_views || 0),
      totalPageViews: Number(statsRow?.total_page_views || 0),
      totalSubscribers: Number(statsRow?.total_subscribers || 0),
    },
    system: {
      isOnline: true,
      databaseSizeKb: Math.round(databaseSizeBytes / 1024),
    },
    posts,
    comments,
  });
}
