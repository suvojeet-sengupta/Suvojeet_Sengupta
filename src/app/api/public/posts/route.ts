import { NextResponse } from 'next/server';
import { getDb } from '@/lib/cloudflare';
import { mapBlogSummary } from '@/lib/blog-utils';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getDb();
  const queryResult = await db
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
          WHERE c.blog_id = b.id AND c.is_approved = 1
        ) AS comments_count
      FROM blogs b
      ORDER BY datetime(b.published_at) DESC
    `)
    .all<Record<string, unknown>>();

  const posts = queryResult.results.map((row) => mapBlogSummary(row));

  return NextResponse.json(
    { posts },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}
