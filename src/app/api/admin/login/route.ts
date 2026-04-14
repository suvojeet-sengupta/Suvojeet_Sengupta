import { NextResponse } from 'next/server';
import {
  attachAdminCookie,
  createAdminSessionToken,
  validateAdminCredentials,
} from '@/lib/admin-auth';
import { normalizeText } from '@/lib/blog-utils';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const email = normalizeText(payload?.email, 120);
    const password = typeof payload?.password === 'string' ? payload.password : '';

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const isValid = await validateAdminCredentials(email, password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const token = await createAdminSessionToken();
    const response = NextResponse.json({ authenticated: true });
    return attachAdminCookie(response, token);
  } catch (error) {
    console.error('Admin login failure:', error);
    const message = error instanceof Error
      ? error.message
      : 'Internal server error while logging in.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
