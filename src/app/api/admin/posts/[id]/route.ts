import { NextResponse } from 'next/server';
import { isAdminRequestAuthenticated } from '@/lib/admin-auth';
import { getDb } from '@/lib/cloudflare';
import {
  createSlug,
  mapBlogSummary,
  normalizeHtmlContent,
  normalizeText,
  optionalText,
  serializeTags,
  toBoolean,
} from '@/lib/blog-utils';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
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

    let tags: string[] = [];
    try {
      tags = typeof post.tags === 'string' ? JSON.parse(post.tags) : (post.tags || []);
    } catch (e) {
      tags = [];
    }

    return NextResponse.json({ 
      post: {
        ...post,
        tags,
        commentsEnabled: toBoolean(post.comments_enabled),
        imageUrl: post.image_url
      } 
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const authenticated = await isAdminRequestAuthenticated(request);
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: rawId } = await context.params;
    const postId = Number(rawId);
    const payload = await request.json();
    const db = getDb();

    const title = normalizeText(payload?.title, 180);
    const content = normalizeHtmlContent(payload?.content, 40000);
    const candidateSlug = normalizeText(payload?.slug, 180);
    const slug = createSlug(candidateSlug || title);

    if (!title || !content || !slug) {
        return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
    }

    const excerpt = optionalText(payload?.excerpt, 500);
    const category = optionalText(payload?.category, 80);
    const imageUrl = optionalText(payload?.imageUrl, 500);
    const tags = serializeTags(payload?.tags);
    const commentsEnabled = toBoolean(payload?.commentsEnabled) ? 1 : 0;

    await db.prepare(`
      UPDATE blogs 
      SET title = ?, slug = ?, excerpt = ?, category = ?, image_url = ?, tags = ?, content = ?, comments_enabled = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      title,
      slug,
      excerpt,
      category,
      imageUrl,
      tags,
      content,
      commentsEnabled,
      postId
    ).run();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const authenticated = await isAdminRequestAuthenticated(request);
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: rawId } = await context.params;
    const postId = Number(rawId);
    const payload = await request.json();
    
    if (typeof payload?.commentsEnabled === 'undefined') {
      return NextResponse.json({ error: 'commentsEnabled is required.' }, { status: 400 });
    }

    const commentsEnabled = toBoolean(payload.commentsEnabled) ? 1 : 0;
    const db = getDb();
    await db
      .prepare('UPDATE blogs SET comments_enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(commentsEnabled, postId)
      .run();

    const postRow = await db
      .prepare(`
        SELECT
          b.id, b.title, b.slug, b.excerpt, b.category, b.image_url, b.published_at, b.views, b.author, b.tags, b.comments_enabled,
          (SELECT COUNT(*) FROM comments c WHERE c.blog_id = b.id) AS comments_count
        FROM blogs b WHERE b.id = ? LIMIT 1
      `)
      .bind(postId)
      .first<Record<string, unknown>>();

    if (!postRow) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    return NextResponse.json({ post: mapBlogSummary(postRow) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const authenticated = await isAdminRequestAuthenticated(request);
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: rawId } = await context.params;
    const postId = Number(rawId);
    const db = getDb();

    await db.prepare('DELETE FROM replies WHERE comment_id IN (SELECT id FROM comments WHERE blog_id = ?)').bind(postId).run();
    await db.prepare('DELETE FROM comments WHERE blog_id = ?').bind(postId).run();
    await db.prepare('DELETE FROM blogs WHERE id = ?').bind(postId).run();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
