import { getRuntimeString } from "./cloudflare";

export function escapeTelegramHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

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
      signal: AbortSignal.timeout(5000),
    });

    return response.ok;
  } catch (err) {
    console.error('Telegram notification failed:', err);
    return false;
  }
}
