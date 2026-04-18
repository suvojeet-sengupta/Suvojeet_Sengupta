import { NextResponse } from 'next/server';
import {
  isAdminRequestAuthenticated,
  createOrUpdateUser,
  generatePasswordHash,
  AdminUser,
} from '@/lib/admin-auth';
import { getKv } from '@/lib/cloudflare';
import { NO_STORE_HEADERS } from '@/lib/http-cache';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!(await isAdminRequestAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const kv = getKv();
    const userList = await kv.list({ prefix: 'user:' });
    const users: Omit<AdminUser, 'passwordHash'>[] = [];

    for (const key of userList.keys) {
      const userJson = await kv.get(key.name);
      if (userJson) {
        const user = JSON.parse(userJson) as AdminUser;
        const { passwordHash, ...safeUser } = user;
        users.push(safeUser);
      }
    }

    return NextResponse.json({ users }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequestAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const { email, password, name } = payload;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const passwordHash = await generatePasswordHash(password);
    const newUser: AdminUser = {
      email,
      passwordHash,
      name,
      createdAt: new Date().toISOString(),
    };

    await createOrUpdateUser(newUser);

    return NextResponse.json({ success: true }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
    if (!(await isAdminRequestAuthenticated(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      const { searchParams } = new URL(request.url);
      const email = searchParams.get('email');
  
      if (!email) {
        return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
      }

      const kv = getKv();
      await kv.delete(`user:${email.trim().toLowerCase()}`);
  
      return NextResponse.json({ success: true }, { headers: NO_STORE_HEADERS });
    } catch (error) {
      console.error('Failed to delete user:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
