import { NextResponse } from 'next/server';
import {
  clearAdminCookies,
  getAdminTokenFromRequest,
  refreshCookieName,
  revokeAdminSession,
} from '@/lib/admin-auth';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // Revoke Access Token session if it was a classic one
  const accessToken = getAdminTokenFromRequest(request);
  if (accessToken) {
    await revokeAdminSession(accessToken);
  }

  // Revoke Refresh Token if present
  const cookieHeader = request.headers.get('cookie');
  const cookiesList = cookieHeader?.split(';') || [];
  const refreshTokenName = refreshCookieName();
  
  for (const cookieEntry of cookiesList) {
    const [rawName, ...rawValueParts] = cookieEntry.trim().split('=');
    if (rawName === refreshTokenName) {
      const refreshToken = rawValueParts.join('=');
      await revokeAdminSession(refreshToken);
      break;
    }
  }

  const response = NextResponse.json({ authenticated: false });
  return clearAdminCookies(response);
}
