import { NextResponse } from 'next/server';
import { isAdminRequestAuthenticated } from '@/lib/admin-auth';
import { getDb, getRuntimeString } from '@/lib/cloudflare';
import { normalizeText, toBoolean } from '@/lib/blog-utils';
import type { BlogReply } from '@/types/blog';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const authenticated = await isAdminRequestAuthenticated(request);
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: rawId } = await context.params;
  const commentId = Number(rawId);
  if (!Number.isFinite(commentId) || commentId <= 0) {
    return NextResponse.json({ error: 'Invalid comment id.' }, { status: 400 });
  }

  const payload = await request.json();
  const content = normalizeText(payload?.content, 2500);
  const preferredName = normalizeText(payload?.name, 80);
  const ownerName = preferredName || getRuntimeString('ADMIN_DISPLAY_NAME') || 'Suvojeet Sengupta';

  if (!content) {
    return NextResponse.json({ error: 'Reply content is required.' }, { status: 400 });
  }

  const db = getDb();
  const comment = await db
    .prepare('SELECT id FROM comments WHERE id = ? LIMIT 1')
    .bind(commentId)
    .first();

  if (!comment) {
    return NextResponse.json({ error: 'Comment not found.' }, { status: 404 });
  }

  const insertResult = await db
    .prepare('INSERT INTO replies (comment_id, name, content, is_owner) VALUES (?, ?, ?, 1)')
    .bind(commentId, ownerName, content)
    .run();

  const insertedId = Number((insertResult.meta || {}).last_row_id || 0);
  const replyRow = insertedId > 0
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

  if (!replyRow) {
    return NextResponse.json({ error: 'Unable to create admin reply.' }, { status: 500 });
  }

  const reply: BlogReply = {
    id: Number(replyRow.id || 0),
    commentId: Number(replyRow.comment_id || 0),
    name: String(replyRow.name || ''),
    content: String(replyRow.content || ''),
    isOwner: toBoolean(replyRow.is_owner),
    createdAt: String(replyRow.created_at || ''),
  };

  return NextResponse.json({ reply }, { status: 201 });
}
