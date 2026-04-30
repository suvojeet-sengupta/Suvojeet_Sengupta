import { NextResponse } from 'next/server';
import { getDb } from '@/lib/cloudflare';
import { normalizeText, toBoolean } from '@/lib/blog-utils';
import { NO_STORE_HEADERS } from '@/lib/http-cache';
import { enforceRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit';
import type { BlogReply } from '@/types/blog';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ commentId: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const rateLimitResult = await enforceRateLimit(request, {
    endpointKey: 'public-comment-reply-create',
    limit: 12,
    windowMs: 10 * 60 * 1000,
  });
  if (!rateLimitResult.allowed) {
    return rateLimitExceededResponse(rateLimitResult, 'Too many replies from this IP. Try again shortly.');
  }

  const { commentId: rawCommentId } = await context.params;
  const commentId = Number(rawCommentId);

  if (!Number.isFinite(commentId) || commentId <= 0) {
    return NextResponse.json({ error: 'Invalid comment id.' }, { status: 400, headers: NO_STORE_HEADERS });
  }

  const payload = await request.json();
  const name = normalizeText(payload?.name, 80);
  const content = normalizeText(payload?.content, 2000);

  if (!name || !content) {
    return NextResponse.json({ error: 'Name and reply are required.' }, { status: 400, headers: NO_STORE_HEADERS });
  }

  const db = getDb();
  const commentRow = await db
    .prepare(`
      SELECT
        c.id,
        b.comments_enabled
      FROM comments c
      INNER JOIN blogs b ON b.id = c.blog_id
      WHERE c.id = ? AND c.is_approved = 1
      LIMIT 1
    `)
    .bind(commentId)
    .first<Record<string, unknown>>();

  if (!commentRow) {
    return NextResponse.json({ error: 'Comment not found.' }, { status: 404, headers: NO_STORE_HEADERS });
  }

  if (!toBoolean(commentRow.comments_enabled)) {
    return NextResponse.json({ error: 'Replies are disabled for this post.' }, { status: 403, headers: NO_STORE_HEADERS });
  }

  const insertResult = await db
    .prepare('INSERT INTO replies (comment_id, name, content, is_owner) VALUES (?, ?, ?, 0)')
    .bind(commentId, name, content)
    .run();

  const insertedId = Number((insertResult.meta || {}).last_row_id || 0);
  const insertedReply = insertedId > 0
    ? await db
      .prepare('SELECT id, comment_id, name, content, is_owner, created_at FROM replies WHERE id = ?')
      .bind(insertedId)
      .first<Record<string, unknown>>()
    : await db
      .prepare(`
        SELECT id, comment_id, name, content, is_owner, created_at
        FROM replies
        WHERE comment_id = ?
        ORDER BY id DESC
        LIMIT 1
      `)
      .bind(commentId)
      .first<Record<string, unknown>>();

  if (!insertedReply) {
    return NextResponse.json({ error: 'Unable to create reply.' }, { status: 500, headers: NO_STORE_HEADERS });
  }

  const reply: BlogReply = {
    id: Number(insertedReply.id || 0),
    commentId: Number(insertedReply.comment_id || 0),
    name: String(insertedReply.name || ''),
    content: String(insertedReply.content || ''),
    isOwner: toBoolean(insertedReply.is_owner),
    createdAt: String(insertedReply.created_at || ''),
  };

  return NextResponse.json({ reply }, { status: 201, headers: NO_STORE_HEADERS });
}
