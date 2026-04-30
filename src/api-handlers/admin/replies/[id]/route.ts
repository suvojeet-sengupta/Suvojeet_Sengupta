import { NextResponse } from 'next/server';
import { isAdminRequestAuthenticated } from '@/lib/admin-auth';
import { getDb } from '@/lib/cloudflare';

export const runtime = 'edge';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: Request, context: RouteContext) {
  const authenticated = await isAdminRequestAuthenticated(request);
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: rawId } = await context.params;
  const replyId = Number(rawId);

  if (!Number.isFinite(replyId) || replyId <= 0) {
    return NextResponse.json({ error: 'Invalid reply id.' }, { status: 400 });
  }

  const db = getDb();

  try {
    const deleteResult = await db.prepare('DELETE FROM replies WHERE id = ?').bind(replyId).run();
    const deletedRows = Number((deleteResult.meta || {}).changes || 0);

    if (deletedRows === 0) {
      return NextResponse.json({ error: 'Reply not found or already deleted.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Reply deleted successfully.' });
  } catch (error) {
    console.error('Error deleting reply:', error);
    return NextResponse.json({ error: 'Failed to delete reply.' }, { status: 500 });
  }
}
