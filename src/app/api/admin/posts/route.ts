import { NextResponse } from 'next/server';
import { isAdminRequestAuthenticated } from '@/lib/admin-auth';
import { getDb, getRuntimeString } from '@/lib/cloudflare';
import {
  createSlug,
  mapBlogSummary,
  normalizeText,
  optionalText,
  serializeTags,
  toBoolean,
} from '@/lib/blog-utils';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const authenticated = await isAdminRequestAuthenticated(request);
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();
  const title = normalizeText(payload?.title, 180);
  const content = normalizeText(payload?.content, 40000);
  const candidateSlug = normalizeText(payload?.slug, 180);
  const slug = createSlug(candidateSlug || title);

  if (!title || !content || !slug) {
    return NextResponse.json({ error: 'Title, slug, and content are required.' }, { status: 400 });
  }

  const excerpt = optionalText(payload?.excerpt, 500) || content.slice(0, 180);
  const category = optionalText(payload?.category, 80);
  const imageUrl = optionalText(payload?.imageUrl, 500);
  const tags = serializeTags(payload?.tags);
  const commentsEnabled = typeof payload?.commentsEnabled === 'undefined' || toBoolean(payload.commentsEnabled) ? 1 : 0;
  const author = optionalText(payload?.author, 80)
    || getRuntimeString('ADMIN_DISPLAY_NAME')
    || 'Suvojeet Sengupta';

  const db = getDb();
  const existing = await db.prepare('SELECT id FROM blogs WHERE slug = ? LIMIT 1').bind(slug).first();
  if (existing) {
    return NextResponse.json({ error: 'Slug already exists. Use a different slug.' }, { status: 409 });
  }

  const insertResult = await db
    .prepare(`
      INSERT INTO blogs (
        title,
        slug,
        content,
        excerpt,
        category,
        image_url,
        published_at,
        comments_enabled,
        views,
        updated_at,
        author,
        tags
      )
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, 0, CURRENT_TIMESTAMP, ?, ?)
    `)
    .bind(
      title,
      slug,
      content,
      excerpt,
      category,
      imageUrl,
      commentsEnabled,
      author,
      tags,
    )
    .run();

  const insertedId = Number((insertResult.meta || {}).last_row_id || 0);
  const insertedPost = insertedId > 0
    ? await db
      .prepare(`
        SELECT
          id,
          title,
          slug,
          excerpt,
          category,
          image_url,
          published_at,
          views,
          author,
          tags,
          comments_enabled,
          0 AS comments_count
        FROM blogs
        WHERE id = ?
      `)
      .bind(insertedId)
      .first<Record<string, unknown>>()
    : await db
      .prepare(`
        SELECT
          id,
          title,
          slug,
          excerpt,
          category,
          image_url,
          published_at,
          views,
          author,
          tags,
          comments_enabled,
          0 AS comments_count
        FROM blogs
        WHERE slug = ?
      `)
      .bind(slug)
      .first<Record<string, unknown>>();

  if (!insertedPost) {
    return NextResponse.json({ error: 'Post created but could not be loaded.' }, { status: 500 });
  }

  return NextResponse.json({ post: mapBlogSummary(insertedPost) }, { status: 201 });
}
