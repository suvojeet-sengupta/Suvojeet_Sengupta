import { NextResponse } from 'next/server';
import { getDb } from '@/lib/cloudflare';
import { PUBLIC_READ_HEADERS } from '@/lib/http-cache';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getDb();
  const queryResult = await db
    .prepare('SELECT * FROM music_videos ORDER BY datetime(published_at) DESC')
    .all<Record<string, unknown>>();

  const videos = queryResult.results.map((row) => ({
    id: Number(row.id || 0),
    title: String(row.title || ''),
    youtubeId: String(row.youtube_id || ''),
    description: typeof row.description === 'string' ? row.description : null,
    publishedAt: String(row.published_at || ''),
  }));

  return NextResponse.json(
    { videos },
    {
      headers: {
        ...PUBLIC_READ_HEADERS,
      },
    },
  );
}
