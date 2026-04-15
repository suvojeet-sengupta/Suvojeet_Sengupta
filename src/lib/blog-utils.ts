import type { BlogSummary } from '@/types/blog';

const encoder = new TextEncoder();

export function normalizeText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().slice(0, maxLength);
}

export function optionalText(value: unknown, maxLength: number): string | null {
  const normalized = normalizeText(value, maxLength);
  return normalized.length > 0 ? normalized : null;
}

export function createSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function parseTags(raw: unknown): string[] {
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return [];
  }

  const trimmed = raw.trim();
  
  // Try to parse as JSON first (handles cases like '["tag1", "tag2"]')
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map(t => String(t).trim()).filter(Boolean);
      }
    } catch (e) {
      // Fallback to comma splitting if JSON parse fails
    }
  }

  // Fallback to comma separated
  return trimmed
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function serializeTags(raw: unknown): string {
  if (Array.isArray(raw)) {
    return raw
      .map((tag) => normalizeText(tag, 30))
      .filter(Boolean)
      .join(',');
  }

  return normalizeText(raw, 400);
}

export function toBoolean(value: unknown): boolean {
  return value === true || value === 1 || value === '1';
}

export function mapBlogSummary(row: Record<string, unknown>): BlogSummary {
  const rawCommentsEnabled = typeof row.comments_enabled !== 'undefined'
    ? row.comments_enabled
    : (typeof row.commentsEnabled !== 'undefined' ? row.commentsEnabled : 1);

  return {
    id: Number(row.id || 0),
    title: String(row.title || ''),
    slug: String(row.slug || ''),
    excerpt: typeof row.excerpt === 'string' ? row.excerpt : null,
    category: typeof row.category === 'string' ? row.category : null,
    imageUrl: typeof row.image_url === 'string'
      ? row.image_url
      : (typeof row.imageUrl === 'string' ? row.imageUrl : null),
    publishedAt: String(row.published_at || row.publishedAt || ''),
    views: Number(row.views || 0),
    likes: Number(row.likes || 0),
    author: String(row.author || 'Suvojeet Sengupta'),
    tags: parseTags(row.tags),
    commentsEnabled: toBoolean(rawCommentsEnabled),
    commentsCount: Number(
      typeof row.comments_count !== 'undefined' ? row.comments_count : (row.commentsCount || 0),
    ),
  };
}

export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  const bytes = new Uint8Array(digest);
  return Array.from(bytes)
    .map((item) => item.toString(16).padStart(2, '0'))
    .join('');
}

export function getClientIp(request: Request): string | null {
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp.trim();
  }

  const forwarded = request.headers.get('x-forwarded-for');
  if (!forwarded) {
    return null;
  }

  return forwarded.split(',')[0].trim();
}

export function calculateReadingTime(content: string): string {
  if (!content) return '1 min read';
  const wordsPerMinute = 225;
  const noOfWords = content.trim().split(/\s+/).length;
  const minutes = noOfWords / wordsPerMinute;
  return `${Math.ceil(minutes)} min read`;
}
