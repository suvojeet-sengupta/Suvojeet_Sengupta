import { NextResponse } from 'next/server';
import { getClientIp, sha256Hex } from '@/lib/blog-utils';
import { getDb } from '@/lib/cloudflare';
import { NO_STORE_HEADERS } from '@/lib/http-cache';

interface RateLimitOptions {
  endpointKey: string;
  limit: number;
  windowMs: number;
}

interface RateLimitRow {
  count: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
}

let ensuredSchema = false;

async function ensureRateLimitSchema() {
  if (ensuredSchema) {
    return;
  }

  const db = getDb();
  await db.batch([
    db.prepare(`
      CREATE TABLE IF NOT EXISTS api_rate_limits (
        id TEXT PRIMARY KEY,
        endpoint_key TEXT NOT NULL,
        ip_hash TEXT NOT NULL,
        window_start INTEGER NOT NULL,
        count INTEGER NOT NULL DEFAULT 0,
        expires_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_api_rate_limits_expires_at ON api_rate_limits (expires_at)'),
  ]);
  ensuredSchema = true;
}

export async function enforceRateLimit(
  request: Request,
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  const safeLimit = Math.max(1, Math.floor(options.limit));
  const safeWindowMs = Math.max(1000, Math.floor(options.windowMs));
  const now = Date.now();
  const windowStart = Math.floor(now / safeWindowMs) * safeWindowMs;
  const windowEnd = windowStart + safeWindowMs;

  await ensureRateLimitSchema();
  const db = getDb();
  await db
    .prepare('DELETE FROM api_rate_limits WHERE expires_at <= ?')
    .bind(now)
    .run();

  const clientIp = getClientIp(request) || 'anonymous';
  const ipHash = await sha256Hex(clientIp);
  const bucketId = `${options.endpointKey}:${ipHash}:${windowStart}`;

  const existing = await db
    .prepare('SELECT count FROM api_rate_limits WHERE id = ? LIMIT 1')
    .bind(bucketId)
    .first<RateLimitRow>();

  const currentCount = Number(existing?.count || 0);
  if (currentCount >= safeLimit) {
    return {
      allowed: false,
      limit: safeLimit,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((windowEnd - now) / 1000)),
    };
  }

  if (!existing) {
    await db
      .prepare(`
        INSERT INTO api_rate_limits (
          id,
          endpoint_key,
          ip_hash,
          window_start,
          count,
          expires_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, 1, ?, ?)
      `)
      .bind(bucketId, options.endpointKey, ipHash, windowStart, windowEnd, now)
      .run();
  } else {
    await db
      .prepare('UPDATE api_rate_limits SET count = count + 1, updated_at = ? WHERE id = ?')
      .bind(now, bucketId)
      .run();
  }

  const usedCount = currentCount + 1;
  return {
    allowed: true,
    limit: safeLimit,
    remaining: Math.max(0, safeLimit - usedCount),
    retryAfterSeconds: Math.max(1, Math.ceil((windowEnd - now) / 1000)),
  };
}

export function rateLimitExceededResponse(result: RateLimitResult, message: string): NextResponse {
  return NextResponse.json(
    {
      error: message,
      retryAfterSeconds: result.retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        ...NO_STORE_HEADERS,
        'Retry-After': String(result.retryAfterSeconds),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
      },
    },
  );
}
