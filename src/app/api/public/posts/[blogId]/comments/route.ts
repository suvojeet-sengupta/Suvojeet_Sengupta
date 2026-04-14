import { NextResponse } from 'next/server';
import { getDb } from '@/lib/cloudflare';
import { normalizeText, optionalText, toBoolean } from '@/lib/blog-utils';
import type { BlogComment } from '@/types/blog';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ blogId: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const { blogId: rawBlogId } = await context.params;
  const blogId = Number(rawBlogId);

  if (!Number.isFinite(blogId) || blogId <= 0) {
    return NextResponse.json({ error: 'Invalid blog id.' }, { status: 400 });
  }

  const payload = await request.json();
  const name = normalizeText(payload?.name, 80);
  const email = optionalText(payload?.email, 120);
  const content = normalizeText(payload?.content, 2500);

  if (!name || !content) {
    return NextResponse.json({ error: 'Name and comment are required.' }, { status: 400 });
  }

  const db = getDb();
  const blogRow = await db
    .prepare('SELECT id, comments_enabled FROM blogs WHERE id = ? LIMIT 1')
    .bind(blogId)
    .first<Record<string, unknown>>();

  if (!blogRow) {
    return NextResponse.json({ error: 'Blog post not found.' }, { status: 404 });
  }

  if (!toBoolean(blogRow.comments_enabled)) {
    return NextResponse.json({ error: 'Comments are disabled for this post.' }, { status: 403 });
  }

  const insertResult = await db
    .prepare('INSERT INTO comments (blog_id, name, email, content, is_approved) VALUES (?, ?, ?, ?, 1)')
    .bind(blogId, name, email, content)
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
      .bind(blogId)
      .first<Record<string, unknown>>();

  if (!insertedRow) {
    return NextResponse.json({ error: 'Unable to create comment.' }, { status: 500 });
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

  return NextResponse.json({ comment }, { status: 201 });
}
