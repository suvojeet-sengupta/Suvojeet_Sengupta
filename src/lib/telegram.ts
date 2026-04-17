import { getRuntimeString } from "./cloudflare";

/**
 * Sends a notification to Suvojeet via Telegram Bot
 * Uses secrets stored in Cloudflare Environment Variables
 */
export async function sendTelegramNotification(text: string) {
  const token = getRuntimeString('TELEGRAM_BOT_TOKEN');
  const chatId = getRuntimeString('TELEGRAM_CHAT_ID');

  if (!token || !chatId) {
    console.error('Telegram credentials missing in environment variables');
    return false;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      }),
    });

    return response.ok;
  } catch (err) {
    console.error('Telegram notification failed:', err);
    return false;
  }
}
