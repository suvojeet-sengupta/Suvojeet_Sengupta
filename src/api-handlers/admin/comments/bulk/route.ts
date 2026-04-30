import { NextResponse } from 'next/server';
import { isAdminRequestAuthenticated } from '@/lib/admin-auth';
import { getDb } from '@/lib/cloudflare';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const authenticated = await isAdminRequestAuthenticated(request);
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json() as { action?: string };
  const action = payload?.action;

  if (action !== 'approve_all_pending' && action !== 'delete_all_pending') {
    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  }

  const db = getDb();

  if (action === 'approve_all_pending') {
    const result = await db
      .prepare('UPDATE comments SET is_approved = 1 WHERE is_approved = 0')
      .run();
    const affected = Number((result.meta || {}).changes || 0);
    return NextResponse.json({ success: true, affected });
  }

  // delete_all_pending: cascade delete replies first, then comments
  await db
    .prepare('DELETE FROM replies WHERE comment_id IN (SELECT id FROM comments WHERE is_approved = 0)')
    .run();
  const result = await db
    .prepare('DELETE FROM comments WHERE is_approved = 0')
    .run();
  const affected = Number((result.meta || {}).changes || 0);
  return NextResponse.json({ success: true, affected });
}
