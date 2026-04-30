import { NextResponse } from 'next/server';
import { isAdminRequestAuthenticated } from '@/lib/admin-auth';
import { getDb } from '@/lib/cloudflare';

export const runtime = 'edge';

export async function PATCH(request: Request) {
  const authenticated = await isAdminRequestAuthenticated(request);
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    const payload = await request.json();
    const { key, value } = payload;

    if (!key) {
      return NextResponse.json({ error: 'Setting key is required.' }, { status: 400 });
    }

    await db
      .prepare('INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
      .bind(key, String(value))
      .run();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Settings update error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
