import { NextResponse } from 'next/server';
import { getDb } from '@/lib/cloudflare';
import { getClientIp, sha256Hex, toBoolean } from '@/lib/blog-utils';

export const runtime = 'edge';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const { slug: rawId } = await context.params;
  const blogId = Number(rawId);
  if (!Number.isFinite(blogId) || blogId <= 0) {
    return NextResponse.json({ error: 'Invalid blog id.' }, { status: 400 });
  }

  const clientIp = getClientIp(request);
  const ipHash = clientIp ? await sha256Hex(clientIp) : 'anonymous';

  const db = getDb();

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
