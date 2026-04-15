import { buildPushHTTPRequest } from '@pushforge/builder';
import { getDb, getRuntimeString } from '@/lib/cloudflare';

function decodeVapidKeys(pub: string, priv: string) {
  const padding = '='.repeat((4 - pub.length % 4) % 4);
  const base64 = (pub + padding).replace(/-/g, '+').replace(/_/g, '/');
  const buffer = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  const b64url = (buf: Uint8Array) => btoa(String.fromCharCode(...buf)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return {
    kty: 'EC',
    crv: 'P-256',
    x: b64url(buffer.slice(1, 33)),
    y: b64url(buffer.slice(33, 65)),
    d: priv
  };
}

export async function sendNotificationToAll(title: string, body: string, url: string) {
  const VAPID_PUBLIC_KEY = getRuntimeString('NEXT_PUBLIC_VAPID_KEY');
  const VAPID_PRIVATE_KEY = getRuntimeString('VAPID_PRIVATE_KEY');
  
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    throw new Error('VAPID keys are missing. Ensure NEXT_PUBLIC_VAPID_KEY and VAPID_PRIVATE_KEY are set.');
  }

  const SUBJECT = 'https://suvojeetsengupta.in';
  const privateJWK = decodeVapidKeys(VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  const db = getDb();

  try {
    const subscriptions = await db.prepare('SELECT endpoint, p256dh, auth FROM push_subscriptions').all();
    if (!subscriptions.results || subscriptions.results.length === 0) {
      console.log('No subscribers found.');
      return;
    }

    const payload = { title, body, url };
    let sentCount = 0;
    let failCount = 0;

    for (const sub of subscriptions.results) {
      const subscription = {
        endpoint: String(sub.endpoint),
        keys: {
          p256dh: String(sub.p256dh),
          auth: String(sub.auth),
        },
      };

      try {
        const req = await buildPushHTTPRequest({
          privateJWK,
          message: {
            adminContact: SUBJECT,
            payload
          },
          subscription
        });

        const response = await fetch(req.endpoint, {
          method: 'POST',
          headers: req.headers,
          body: req.body
        });

        if (response.status === 410 || response.status === 404) {
          await db.prepare('DELETE FROM push_subscriptions WHERE endpoint = ?').bind(subscription.endpoint).run();
          failCount++;
        } else if (!response.ok) {
          failCount++;
        } else {
          sentCount++;
        }
      } catch (error: any) {
        failCount++;
      }
    }

    console.log(`Push completed: ${sentCount} sent, ${failCount} failed.`);
  } catch (err) {
    console.error('Failed to send push notifications:', err);
    throw err;
  }
}
