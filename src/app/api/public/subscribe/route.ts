import { NextResponse } from 'next/server';
import { getDb } from '@/lib/cloudflare';
import { NO_STORE_HEADERS } from '@/lib/http-cache';
import { enforceRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const rateLimitResult = await enforceRateLimit(request, {
      endpointKey: 'public-subscribe',
      limit: 8,
      windowMs: 60 * 60 * 1000,
    });
    if (!rateLimitResult.allowed) {
      return rateLimitExceededResponse(rateLimitResult, 'Too many subscribe requests from this IP. Try later.');
    }

    const subscription = await request.json();
    
    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400, headers: NO_STORE_HEADERS });
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

    return NextResponse.json({ success: true }, { headers: NO_STORE_HEADERS });
  } catch (err) {
    console.error('Subscription error:', err);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500, headers: NO_STORE_HEADERS });
  }
}
