import { NextResponse } from 'next/server';
import { getDb } from '@/lib/cloudflare';
import { normalizeText, optionalText, toBoolean } from '@/lib/blog-utils';
import { NO_STORE_HEADERS, PUBLIC_READ_HEADERS } from '@/lib/http-cache';
import { enforceRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit';
import type { BlogComment, BlogReply } from '@/types/blog';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

async function getBlogInfo(db: any, slugOrId: string) {
  const id = Number(slugOrId);
  if (Number.isFinite(id) && id > 0) {
    const row = await db
      .prepare('SELECT id, comments_enabled FROM blogs WHERE id = ? LIMIT 1')
      .bind(id)
      .first<Record<string, unknown>>();
    if (row) {
      return { id: Number(row.id), commentsEnabled: toBoolean(row.comments_enabled) };
    }
  }

  const row = await db
    .prepare('SELECT id, comments_enabled FROM blogs WHERE slug = ? LIMIT 1')
    .bind(slugOrId)
    .first<Record<string, unknown>>();
  if (row) {
    return { id: Number(row.id), commentsEnabled: toBoolean(row.comments_enabled) };
  }

  return null;
}

export async function GET(request: Request, context: RouteContext) {
  const { slug: rawSlugOrId } = await context.params;
  const slugOrId = decodeURIComponent(rawSlugOrId || '').trim();

  if (!slugOrId) {
    return NextResponse.json({ error: 'Invalid post identifier.' }, { status: 400, headers: NO_STORE_HEADERS });
  }

  const db = getDb();
  const blog = await getBlogInfo(db, slugOrId);

  if (!blog) {
    return NextResponse.json({ error: 'Blog post not found.' }, { status: 404, headers: NO_STORE_HEADERS });
  }

  const commentsQuery = await db
    .prepare(`
      SELECT id, blog_id, name, email, content, is_approved, created_at
      FROM comments
      WHERE blog_id = ? AND is_approved = 1
      ORDER BY datetime(created_at) DESC
    `)
    .bind(blog.id)
    .all<Record<string, unknown>>();

  const commentIds = commentsQuery.results.map((row) => Number(row.id || 0)).filter(Boolean);
  const repliesByComment = new Map<number, BlogReply[]>();

  if (commentIds.length > 0) {
    const placeholders = commentIds.map(() => '?').join(', ');
    const repliesQuery = await db
      .prepare(`
        SELECT id, comment_id, name, content, is_owner, created_at
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

      const existing = repliesByComment.get(commentId) || [];
      existing.push(mappedReply);
      repliesByComment.set(commentId, existing);
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

  return NextResponse.json(
    { comments, count: comments.length },
    { status: 200, headers: PUBLIC_READ_HEADERS }
  );
}

export async function POST(request: Request, context: RouteContext) {
  const rateLimitResult = await enforceRateLimit(request, {
    endpointKey: 'public-comment-create',
    limit: 10,
    windowMs: 10 * 60 * 1000,
  });
  if (!rateLimitResult.allowed) {
    return rateLimitExceededResponse(rateLimitResult, 'Too many comments from this IP. Try again in a few minutes.');
  }

  const { slug: rawSlugOrId } = await context.params;
  const slugOrId = decodeURIComponent(rawSlugOrId || '').trim();

  if (!slugOrId) {
    return NextResponse.json({ error: 'Invalid post identifier.' }, { status: 400, headers: NO_STORE_HEADERS });
  }

  const db = getDb();
  const blog = await getBlogInfo(db, slugOrId);

  if (!blog) {
    return NextResponse.json({ error: 'Blog post not found.' }, { status: 404, headers: NO_STORE_HEADERS });
  }

  if (!blog.commentsEnabled) {
    return NextResponse.json({ error: 'Comments are disabled for this post.' }, { status: 403, headers: NO_STORE_HEADERS });
  }

  const payload = await request.json();
  const name = normalizeText(payload?.name || payload?.author, 80);
  const email = optionalText(payload?.email, 120);
  const content = normalizeText(payload?.content, 2500);

  if (!name || !content) {
    return NextResponse.json({ error: 'Name and comment are required.' }, { status: 400, headers: NO_STORE_HEADERS });
  }

  const insertResult = await db
    .prepare('INSERT INTO comments (blog_id, name, email, content, is_approved) VALUES (?, ?, ?, ?, 1)')
    .bind(blog.id, name, email, content)
    .run();

  const insertedId = Number((insertResult.meta || {}).last_row_id || 0);
  const insertedRow = insertedId > 0
    ? await db
      .prepare('SELECT id, blog_id, name, email, content, is_approved, created_at FROM comments WHERE id = ?')
      .bind(insertedId)
      .first<Record<string, unknown>>()
    : await db
      .prepare(`
        SELECT id, blog_id, name, email, content, is_approved, created_at
        FROM comments
        WHERE blog_id = ?
        ORDER BY id DESC
        LIMIT 1
      `)
      .bind(blog.id)
      .first<Record<string, unknown>>();

  if (!insertedRow) {
    return NextResponse.json({ error: 'Unable to create comment.' }, { status: 500, headers: NO_STORE_HEADERS });
  }

  const comment: BlogComment = {
    id: Number(insertedRow.id || 0),
    blogId: Number(insertedRow.blog_id || 0),
    name: String(insertedRow.name || ''),
    email: typeof insertedRow.email === 'string' ? insertedRow.email : null,
    content: String(insertedRow.content || ''),
    isApproved: toBoolean(insertedRow.is_approved),
    createdAt: String(insertedRow.created_at || ''),
    replies: [],
  };

  return NextResponse.json({ comment }, { status: 201, headers: NO_STORE_HEADERS });
}
