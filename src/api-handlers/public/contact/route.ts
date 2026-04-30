import { NextResponse } from 'next/server';
import { getDb } from '@/lib/cloudflare';
import { normalizeText, optionalText } from '@/lib/blog-utils';
import { sendTelegramNotification, escapeTelegramHtml } from '@/lib/telegram';
import { enforceRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit';

export const runtime = 'edge';

export async function POST(request: Request) {
  const rateLimitResult = await enforceRateLimit(request, {
    endpointKey: 'public-contact',
    limit: 5,
    windowMs: 15 * 60 * 1000, // 5 messages per 15 mins
  });

  if (!rateLimitResult.allowed) {
    return rateLimitExceededResponse(rateLimitResult, 'Too many messages. Please try again later.');
  }

  try {
    const payload = await request.json();
    const name = normalizeText(payload?.name, 100);
    const email = normalizeText(payload?.email, 150);
    const subject = optionalText(payload?.subject, 200);
    const type = optionalText(payload?.type, 50);
    const message = normalizeText(payload?.message, 5000);

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    const db = getDb();
    await db.prepare(`
      INSERT INTO messages (name, email, subject, type, message)
      VALUES (?, ?, ?, ?, ?)
    `).bind(name, email, subject, type, message).run();

    const telegramText = `
<b>📩 New Contact Message</b>
<b>From:</b> ${escapeTelegramHtml(name)}
<b>Email:</b> ${escapeTelegramHtml(email)}
<b>Type:</b> ${escapeTelegramHtml(type || 'General')}
<b>Subject:</b> ${escapeTelegramHtml(subject || 'N/A')}

<b>Message:</b>
${escapeTelegramHtml(message)}
    `.trim();

    await sendTelegramNotification(telegramText);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
