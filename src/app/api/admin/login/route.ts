import { NextResponse } from 'next/server';
import {
  attachAdminCookie,
  createAdminSessionToken,
  validateAdminCredentials,
} from '@/lib/admin-auth';
import { normalizeText } from '@/lib/blog-utils';
import { NO_STORE_HEADERS } from '@/lib/http-cache';
import { enforceRateLimit, rateLimitExceededResponse } from '@/lib/rate-limit';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const rateLimitResult = await enforceRateLimit(request, {
      endpointKey: 'admin-login',
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!rateLimitResult.allowed) {
      return rateLimitExceededResponse(rateLimitResult, 'Too many login attempts. Please try again soon.');
    }

    const payload = await request.json();
    const email = normalizeText(payload?.email, 120);
    const password = typeof payload?.password === 'string' ? payload.password : '';

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400, headers: NO_STORE_HEADERS });
    }

    const isValid = await validateAdminCredentials(email, password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401, headers: NO_STORE_HEADERS });
    }

    const token = await createAdminSessionToken(email);
    const response = NextResponse.json({ authenticated: true }, { headers: NO_STORE_HEADERS });
    return attachAdminCookie(response, token);
  } catch (error) {
    console.error('Admin login failure:', error);
    const message = error instanceof Error
      ? error.message
      : 'Internal server error while logging in.';
    return NextResponse.json({ error: message }, { status: 500, headers: NO_STORE_HEADERS });
  }
}
