import { NextResponse } from 'next/server';
import { isAdminRequestAuthenticated } from '@/lib/admin-auth';
import { getDb } from '@/lib/cloudflare';
import { mapBlogSummary, toBoolean } from '@/lib/blog-utils';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const authenticated = await isAdminRequestAuthenticated(request);
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: rawId } = await context.params;
  const postId = Number(rawId);
  const db = getDb();

  const post = await db.prepare(`
    SELECT * FROM blogs WHERE id = ? LIMIT 1
  `).bind(postId).first<any>();

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  // Tags are stored as JSON string in D1
  const tags = typeof post.tags === 'string' ? JSON.parse(post.tags) : (post.tags || []);

  return NextResponse.json({ 
    post: {
      ...post,
      tags,
      commentsEnabled: toBoolean(post.comments_enabled),
      imageUrl: post.image_url
    } 
  });
}

export async function PUT(request: Request, context: RouteContext) {
  const authenticated = await isAdminRequestAuthenticated(request);
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: rawId } = await context.params;
  const postId = Number(rawId);
  const payload = await request.json();
  const db = getDb();

  const tagsJson = JSON.stringify(
    payload.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
  );

  await db.prepare(`
    UPDATE blogs 
    SET title = ?, slug = ?, excerpt = ?, category = ?, image_url = ?, tags = ?, content = ?, comments_enabled = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(
    payload.title,
    payload.slug || payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    payload.excerpt,
    payload.category,
    payload.imageUrl,
    tagsJson,
    payload.content,
    payload.commentsEnabled ? 1 : 0,
    postId
  ).run();

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request, context: RouteContext) {
  const authenticated = await isAdminRequestAuthenticated(request);
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: rawId } = await context.params;
  const postId = Number(rawId);
  if (!Number.isFinite(postId) || postId <= 0) {
    return NextResponse.json({ error: 'Invalid post id.' }, { status: 400 });
  }

  const payload = await request.json();
  if (typeof payload?.commentsEnabled === 'undefined') {
    return NextResponse.json({ error: 'commentsEnabled is required.' }, { status: 400 });
  }

  const commentsEnabled = toBoolean(payload.commentsEnabled) ? 1 : 0;
  const db = getDb();
  const updateResult = await db
    .prepare('UPDATE blogs SET comments_enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(commentsEnabled, postId)
    .run();

  const changedRows = Number((updateResult.meta || {}).changes || 0);
  if (changedRows === 0) {
    return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
  }

  const postRow = await db
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
      WHERE b.id = ?
      LIMIT 1
    `)
    .bind(postId)
    .first<Record<string, unknown>>();

  if (!postRow) {
    return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
  }

  return NextResponse.json({ post: mapBlogSummary(postRow) });
}

export async function DELETE(request: Request, context: RouteContext) {
  const authenticated = await isAdminRequestAuthenticated(request);
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: rawId } = await context.params;
  const postId = Number(rawId);
  if (!Number.isFinite(postId) || postId <= 0) {
    return NextResponse.json({ error: 'Invalid post id.' }, { status: 400 });
  }

  const db = getDb();

  // Also delete associated comments and replies
  await db.prepare('DELETE FROM replies WHERE comment_id IN (SELECT id FROM comments WHERE blog_id = ?)').bind(postId).run();
  await db.prepare('DELETE FROM comments WHERE blog_id = ?').bind(postId).run();

  const deleteResult = await db.prepare('DELETE FROM blogs WHERE id = ?').bind(postId).run();
  const deletedRows = Number((deleteResult.meta || {}).changes || 0);

  if (deletedRows === 0) {
    return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
