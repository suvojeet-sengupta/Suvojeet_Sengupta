import { NextResponse } from 'next/server';
import { getDb } from '@/lib/cloudflare';
import { getClientIp, mapBlogSummary, sha256Hex, toBoolean } from '@/lib/blog-utils';
import type { BlogComment, BlogPost, BlogReply } from '@/types/blog';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { slug: rawSlug } = await context.params;
  const slug = decodeURIComponent(rawSlug || '').trim();

  if (!slug) {
    return NextResponse.json({ error: 'Invalid blog slug.' }, { status: 400 });
  }

  const db = getDb();
  const postRow = await db
    .prepare(`
      SELECT
        b.id,
        b.title,
        b.slug,
        b.content,
        b.excerpt,
        b.category,
        b.image_url,
        b.published_at,
        b.views,
        b.author,
        b.tags,
        b.comments_enabled,
        b.updated_at,
        (
          SELECT COUNT(*)
          FROM comments c
          WHERE c.blog_id = b.id AND c.is_approved = 1
        ) AS comments_count
      FROM blogs b
      WHERE b.slug = ?
      LIMIT 1
    `)
    .bind(slug)
    .first<Record<string, unknown>>();

  if (!postRow) {
    return NextResponse.json({ error: 'Blog post not found.' }, { status: 404 });
  }

  const blogId = Number(postRow.id || 0);
  const clientIp = getClientIp(request);
  const ipHash = clientIp ? await sha256Hex(clientIp) : null;
  await db.batch([
    db
      .prepare('UPDATE blogs SET views = COALESCE(views, 0) + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(blogId),
    db.prepare('INSERT INTO page_views (path, ip_hash) VALUES (?, ?)').bind(`/blog/${slug}`, ipHash),
  ]);

  const commentsQuery = await db
    .prepare(`
      SELECT
        id,
        blog_id,
        name,
        email,
        content,
        is_approved,
        created_at
      FROM comments
      WHERE blog_id = ? AND is_approved = 1
      ORDER BY datetime(created_at) DESC
    `)
    .bind(blogId)
    .all<Record<string, unknown>>();

  const commentIds = commentsQuery.results.map((row) => Number(row.id || 0)).filter(Boolean);
  const repliesByComment = new Map<number, BlogReply[]>();

  if (commentIds.length > 0) {
    const placeholders = commentIds.map(() => '?').join(', ');
    const repliesQuery = await db
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

    for (const row of repliesQuery.results) {
      const commentId = Number(row.comment_id || 0);
      const mappedReply: BlogReply = {
        id: Number(row.id || 0),
        commentId,
        name: String(row.name || ''),
        content: String(row.content || ''),
        isOwner: toBoolean(row.is_owner),
        createdAt: String(row.created_at || ''),
      };

      const existingReplies = repliesByComment.get(commentId) || [];
      existingReplies.push(mappedReply);
      repliesByComment.set(commentId, existingReplies);
    }
  }

  const comments: BlogComment[] = commentsQuery.results.map((row) => {
    const commentId = Number(row.id || 0);
    return {
      id: commentId,
      blogId: Number(row.blog_id || 0),
      name: String(row.name || ''),
      email: typeof row.email === 'string' ? row.email : null,
      content: String(row.content || ''),
      isApproved: toBoolean(row.is_approved),
      createdAt: String(row.created_at || ''),
      replies: repliesByComment.get(commentId) || [],
    };
  });

  const summary = mapBlogSummary(postRow);
  const post: BlogPost = {
    ...summary,
    views: summary.views + 1,
    content: String(postRow.content || ''),
    updatedAt: typeof postRow.updated_at === 'string' ? postRow.updated_at : null,
    comments,
  };

  return NextResponse.json(
    { post },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}
