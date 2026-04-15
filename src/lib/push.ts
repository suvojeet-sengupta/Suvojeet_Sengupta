import webpush from 'web-push';
import { getDb, getRuntimeString } from '@/lib/cloudflare';

// We get the keys from the env or hardcode the one generated earlier
const VAPID_PUBLIC_KEY = getRuntimeString('NEXT_PUBLIC_VAPID_KEY') || 'BALkX6Mm8qnve2mdG2ZPhth422pULKyehs68v8L0aH57ziTI4jYifwh0vo5MO1WHy7S28RJC1l3bgm6ezbsDxnE';
const VAPID_PRIVATE_KEY = getRuntimeString('VAPID_PRIVATE_KEY') || 'G4H_Y4Q4Uwx1WDa4ycc3mMAeATvjfH6rYMw_pEka6M4';
const SUBJECT = 'mailto:suvojeet@suvojeetsengupta.in';

webpush.setVapidDetails(SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export async function sendNotificationToAll(title: string, body: string, url: string) {
  const db = getDb();
  
  try {
    const subscriptions = await db
      .prepare('SELECT endpoint, p256dh, auth FROM push_subscriptions')
      .all<{ endpoint: string; p256dh: string; auth: string }>();

    if (!subscriptions.results || subscriptions.results.length === 0) {
      return 0;
    }

    const payload = JSON.stringify({
      title,
      body,
      url,
      icon: '/suvojeet.jpg'
    });

    let sentCount = 0;

    for (const sub of subscriptions.results) {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      };

      try {
        await webpush.sendNotification(pushSubscription, payload);
        sentCount++;
      } catch (error: any) {
        if (error.statusCode === 404 || error.statusCode === 410) {
          // Subscription expired or unsubscribed
          await db.prepare('DELETE FROM push_subscriptions WHERE endpoint = ?').bind(sub.endpoint).run();
        } else {
          console.error('Push error:', error);
        }
      }
    }

    return sentCount;
  } catch (error) {
    console.error('Failed to get subscriptions:', error);
    return 0;
  }
}
