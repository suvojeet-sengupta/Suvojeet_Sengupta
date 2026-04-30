import { NextResponse } from 'next/server';
import { getDb } from '@/lib/cloudflare';
import { NO_STORE_HEADERS } from '@/lib/http-cache';

export const runtime = 'edge';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const videoId = Number(id);

  if (!videoId) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const db = getDb();
  
  try {
    await db.prepare('UPDATE music_videos SET plays = COALESCE(plays, 0) + 1 WHERE id = ?')
      .bind(videoId)
      .run();
      
    return NextResponse.json({ success: true }, { headers: NO_STORE_HEADERS });
  } catch (err) {
    console.error('Failed to increment play count:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
