import { NextResponse } from 'next/server';
import { isAdminRequestAuthenticated } from '@/lib/admin-auth';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authenticated = await isAdminRequestAuthenticated(request);
  return NextResponse.json({ authenticated });
}
