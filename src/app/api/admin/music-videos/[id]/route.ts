import { NextResponse } from 'next/server';
import { isAdminRequestAuthenticated } from '@/lib/admin-auth';
import { getDb } from '@/lib/cloudflare';

export const runtime = 'edge';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authenticated = await isAdminRequestAuthenticated(request);
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = params.id;
  const db = getDb();

  await db.prepare('DELETE FROM music_videos WHERE id = ?').bind(id).run();

  return NextResponse.json({ message: 'Video deleted successfully' });
}
