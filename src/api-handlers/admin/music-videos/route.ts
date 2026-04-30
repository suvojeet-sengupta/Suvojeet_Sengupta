import { NextResponse } from 'next/server';
import { isAdminRequestAuthenticated } from '@/lib/admin-auth';
import { getDb } from '@/lib/cloudflare';
import { normalizeText, optionalText } from '@/lib/blog-utils';

export const runtime = 'edge';

function extractYoutubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function POST(request: Request) {
  const authenticated = await isAdminRequestAuthenticated(request);
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();
  const title = normalizeText(payload?.title, 180);
  const videoUrl = normalizeText(payload?.videoUrl, 500);
  const description = optionalText(payload?.description, 500);

  if (!title || !videoUrl) {
    return NextResponse.json({ error: 'Title and Video URL are required.' }, { status: 400 });
  }

  const youtubeId = extractYoutubeId(videoUrl);
  if (!youtubeId) {
    return NextResponse.json({ error: 'Invalid YouTube URL.' }, { status: 400 });
  }

  const db = getDb();
  await db
    .prepare(`
      INSERT INTO music_videos (title, youtube_id, description, published_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `)
    .bind(title, youtubeId, description)
    .run();

  return NextResponse.json({ message: 'Video added successfully' }, { status: 201 });
}
