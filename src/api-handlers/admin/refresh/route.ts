import { NextResponse } from 'next/server';
import { 
  createAccessToken, 
  verifyRefreshToken, 
  refreshCookieName,
  attachAdminCookie,
  attachRefreshTokenCookie,
  createRefreshToken
} from '@/lib/admin-auth';
import { NO_STORE_HEADERS } from '@/lib/http-cache';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const refreshTokenName = refreshCookieName();
    
    // Manual cookie parsing for reliability in Edge
    const cookiesList = cookieHeader?.split(';') || [];
    let refreshToken: string | null = null;
    
    for (const cookieEntry of cookiesList) {
      const [rawName, ...rawValueParts] = cookieEntry.trim().split('=');
      if (rawName === refreshTokenName) {
        refreshToken = rawValueParts.join('=');
        break;
      }
    }

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token missing.' }, { status: 401, headers: NO_STORE_HEADERS });
    }

    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired refresh token.' }, { status: 401, headers: NO_STORE_HEADERS });
    }

    const newAccessToken = await createAccessToken(payload.email);
    const newRefreshToken = await createRefreshToken(payload.email);

    const response = NextResponse.json({ 
      accessToken: newAccessToken 
    }, { headers: NO_STORE_HEADERS });

    attachAdminCookie(response, newAccessToken);
    return attachRefreshTokenCookie(response, newRefreshToken);
  } catch (error) {
    console.error('Token refresh failure:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500, headers: NO_STORE_HEADERS });
  }
}
