import { NextResponse } from 'next/server';
import {
  clearAdminCookie,
  getAdminTokenFromRequest,
  revokeAdminSession,
} from '@/lib/admin-auth';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const token = getAdminTokenFromRequest(request);
  if (token) {
    await revokeAdminSession(token);
  }

  const response = NextResponse.json({ authenticated: false });
  return clearAdminCookie(response);
}
