import { NextResponse } from 'next/server';
import { getDb } from '@/lib/cloudflare';
import { getClientIp, sha256Hex, toBoolean } from '@/lib/blog-utils';

export const runtime = 'edge';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const { slug: rawSlugOrId } = await context.params;
  const db = getDb();
  
  let blogId: number;
  const possibleId = Number(rawSlugOrId);

  if (Number.isFinite(possibleId) && possibleId > 0) {
    blogId = possibleId;
  } else {
    // Lookup by slug
    const post = await db
      .prepare('SELECT id FROM blogs WHERE slug = ? LIMIT 1')
      .bind(rawSlugOrId)
      .first<Record<string, number>>();
    
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found.' }, { status: 404 });
    }
    blogId = post.id;
  }

  const clientIp = getClientIp(request);
  const ipHash = clientIp ? await sha256Hex(clientIp) : 'anonymous';

  // Check if already liked
  const existingLike = await db
    .prepare('SELECT 1 FROM blog_likes WHERE blog_id = ? AND ip_hash = ?')
    .bind(blogId, ipHash)
    .first();

  if (existingLike) {
    // Unlike
    await db.batch([
      db.prepare('DELETE FROM blog_likes WHERE blog_id = ? AND ip_hash = ?').bind(blogId, ipHash),
      db.prepare('UPDATE blogs SET likes = MAX(0, COALESCE(likes, 0) - 1) WHERE id = ?').bind(blogId),
    ]);
    return NextResponse.json({ liked: false });
  }

  // Like
  await db.batch([
    db.prepare('INSERT INTO blog_likes (blog_id, ip_hash) VALUES (?, ?)').bind(blogId, ipHash),
    db.prepare('UPDATE blogs SET likes = COALESCE(likes, 0) + 1 WHERE id = ?').bind(blogId),
  ]);

  return NextResponse.json({ liked: true });
}
