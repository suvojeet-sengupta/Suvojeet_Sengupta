import { NextResponse } from 'next/server';
import { getDb, getRuntimeString } from '@/lib/cloudflare';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  const expectedKey = getRuntimeString('MIGRATION_KEY') || 'dev-migration-123';

  if (key !== expectedKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();

  try {
    // 1. Add likes column to blogs table if it doesn't exist
    // SQLite doesn't have IF NOT EXISTS for ADD COLUMN easily in all versions, 
    // but D1 supports it or we can just try-catch.
    try {
      await db.prepare('ALTER TABLE blogs ADD COLUMN likes INTEGER DEFAULT 0').run();
    } catch (e) {
      console.log('Column likes might already exist');
    }

    // 2. Create blog_likes table
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS blog_likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        blog_id INTEGER NOT NULL,
        ip_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(blog_id, ip_hash)
      )
    `).run();

    return NextResponse.json({ success: true, message: 'Migration completed successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
