import { NextResponse } from 'next/server';
import { getDb } from '@/lib/cloudflare';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const subscription = await request.json();
    
    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400 });
    }

    const { endpoint, keys: { p256dh, auth } } = subscription;

    const db = getDb();
    
    // Insert or update subscription
    await db.prepare(`
      INSERT INTO push_subscriptions (endpoint, p256dh, auth)
      VALUES (?, ?, ?)
      ON CONFLICT(endpoint) DO UPDATE SET 
        p256dh = excluded.p256dh,
        auth = excluded.auth,
        created_at = CURRENT_TIMESTAMP
    `).bind(endpoint, p256dh, auth).run();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Subscription error:', err);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
