import webpush from 'web-push';
import { getDb, getRuntimeString } from '@/lib/cloudflare';

export async function sendNotificationToAll(title: string, body: string, url: string) {
  // Move VAPID setup inside the function to avoid crashes during build-time evaluation
  const VAPID_PUBLIC_KEY = getRuntimeString('NEXT_PUBLIC_VAPID_KEY') || 'BALkX6Mm8qnve2mdG2ZPhth422pULKyehs68v8L0aH57ziTI4jYifwh0vo5MO1WHy7S28RJC1l3bgm6ezbsDxnE';
  const VAPID_PRIVATE_KEY = getRuntimeString('VAPID_PRIVATE_KEY') || 'G4H_Y4Q4Uwx1WDa4ycc3mMAeATvjfH6rYMw_pEka6M4';
  const SUBJECT = 'https://suvojeetsengupta.in';

  try {
    webpush.setVapidDetails(SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  } catch (err) {
    console.error('VAPID evaluation error:', err);
  }

  const db = getDb();
  
  try {
    // Get all subscriptions
    const subscriptions = await db.prepare('SELECT endpoint, p256dh, auth FROM push_subscriptions').all();
    
    if (!subscriptions.results || subscriptions.results.length === 0) {
      console.log('No subscribers found.');
      return;
    }

    const payload = JSON.stringify({
      title,
      body,
      url,
    });

    let sentCount = 0;
    let failCount = 0;

    for (const sub of subscriptions.results) {
      const pushSubscription = {
        endpoint: String(sub.endpoint),
        keys: {
          p256dh: String(sub.p256dh),
          auth: String(sub.auth),
        },
      };

      try {
        await webpush.sendNotification(pushSubscription, payload);
        sentCount++;
      } catch (error: any) {
        // If 410 (Gone) or 404 (Not Found), remove the expired subscription
        if (error.statusCode === 410 || error.statusCode === 404) {
          await db.prepare('DELETE FROM push_subscriptions WHERE endpoint = ?').bind(sub.endpoint).run();
        }
        failCount++;
      }
    }

    console.log(`Push completed: ${sentCount} sent, ${failCount} failed.`);
  } catch (err) {
    console.error('Failed to send push notifications:', err);
    throw err;
  }
}
