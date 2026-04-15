import { NextResponse } from 'next/server';
import { isAdminRequestAuthenticated } from '@/lib/admin-auth';
import { getDb } from '@/lib/cloudflare';
import { toBoolean } from '@/lib/blog-utils';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
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
  if (typeof payload?.isApproved === 'undefined') {
    return NextResponse.json({ error: 'isApproved is required.' }, { status: 400 });
  }

  const isApproved = toBoolean(payload.isApproved) ? 1 : 0;
  const db = getDb();
  const updateResult = await db
    .prepare('UPDATE comments SET is_approved = ? WHERE id = ?')
    .bind(isApproved, commentId)
    .run();

  const updatedRows = Number((updateResult.meta || {}).changes || 0);
  if (updatedRows === 0) {
    return NextResponse.json({ error: 'Comment not found.' }, { status: 404 });
  }

  const updatedComment = await db
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
      WHERE c.id = ?
      LIMIT 1
    `)
    .bind(commentId)
    .first<Record<string, unknown>>();

  return NextResponse.json({
    comment: {
      id: Number(updatedComment?.id || 0),
      blogId: Number(updatedComment?.blog_id || 0),
      blogTitle: String(updatedComment?.blog_title || ''),
      name: String(updatedComment?.name || ''),
      email: typeof updatedComment?.email === 'string' ? updatedComment.email : null,
      content: String(updatedComment?.content || ''),
      isApproved: toBoolean(updatedComment?.is_approved),
      createdAt: String(updatedComment?.created_at || ''),
    },
  });
}

export async function DELETE(request: Request, context: RouteContext) {
  const authenticated = await isAdminRequestAuthenticated(request);
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: rawId } = await context.params;
  const commentId = Number(rawId);
  if (!Number.isFinite(commentId) || commentId <= 0) {
    return NextResponse.json({ error: 'Invalid comment id.' }, { status: 400 });
  }

  const db = getDb();
  
  // Also delete associated replies
  await db.prepare('DELETE FROM replies WHERE comment_id = ?').bind(commentId).run();
  
  const deleteResult = await db.prepare('DELETE FROM comments WHERE id = ?').bind(commentId).run();
  const deletedRows = Number((deleteResult.meta || {}).changes || 0);

  if (deletedRows === 0) {
    return NextResponse.json({ error: 'Comment not found.' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
