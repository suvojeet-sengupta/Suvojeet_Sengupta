import { NextResponse } from 'next/server';
import { 
  getAdminTokenFromRequest, 
  getAuthenticatedUserEmail, 
  isSuperAdmin 
} from '@/lib/admin-auth';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const token = getAdminTokenFromRequest(request);
  const email = await getAuthenticatedUserEmail(token);
  
  return NextResponse.json({ 
    authenticated: email !== null,
    email: email,
    isSuperAdmin: isSuperAdmin(email)
  });
}
