import { getDb } from './cloudflare';
import { MusicVideo } from '@/types/music';

export async function getMusicVideos(): Promise<MusicVideo[]> {
  try {
    const db = getDb();
    const queryResult = await db
      .prepare('SELECT * FROM music_videos ORDER BY datetime(published_at) DESC')
      .all<Record<string, unknown>>();

    return queryResult.results.map((row) => ({
      id: Number(row.id || 0),
      title: String(row.title || ''),
      youtubeId: String(row.youtube_id || ''),
      description: typeof row.description === 'string' ? row.description : null,
      publishedAt: String(row.published_at || ''),
      plays: Number(row.plays || 0),
    }));
  } catch (error) {
    console.error('Error fetching music videos from DB:', error);
    return [];
  }
}
