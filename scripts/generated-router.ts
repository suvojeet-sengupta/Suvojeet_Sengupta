import { NextResponse } from 'next/server';

import * as route0 from '@/api-handlers/admin/comments/[id]/replies/route';
import * as route1 from '@/api-handlers/admin/comments/[id]/route';
import * as route2 from '@/api-handlers/admin/comments/bulk/route';
import * as route3 from '@/api-handlers/admin/login/route';
import * as route4 from '@/api-handlers/admin/logout/route';
import * as route5 from '@/api-handlers/admin/messages/[id]/route';
import * as route6 from '@/api-handlers/admin/music-videos/[id]/route';
import * as route7 from '@/api-handlers/admin/music-videos/route';
import * as route8 from '@/api-handlers/admin/overview/route';
import * as route9 from '@/api-handlers/admin/posts/[id]/route';
import * as route10 from '@/api-handlers/admin/posts/route';
import * as route11 from '@/api-handlers/admin/replies/[id]/route';
import * as route12 from '@/api-handlers/admin/session/route';
import * as route13 from '@/api-handlers/admin/settings/route';
import * as route14 from '@/api-handlers/admin/users/route';
import * as route15 from '@/api-handlers/public/comments/[commentId]/replies/route';
import * as route16 from '@/api-handlers/public/contact/route';
import * as route17 from '@/api-handlers/public/music-videos/[id]/play/route';
import * as route18 from '@/api-handlers/public/music-videos/route';
import * as route19 from '@/api-handlers/public/posts/[slug]/comments/route';
import * as route20 from '@/api-handlers/public/posts/[slug]/like/route';
import * as route21 from '@/api-handlers/public/posts/[slug]/route';
import * as route22 from '@/api-handlers/public/posts/route';
import * as route23 from '@/api-handlers/public/subscribe/route';


export const runtime = 'edge';
export const dynamic = 'force-dynamic';

function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  const paramNames: string[] = [];
  const regexStr = pattern.replace(/\[([^\]]+)\]/g, (_, paramName) => {
    paramNames.push(paramName);
    return '([^/]+)';
  });
  const regex = new RegExp('^' + regexStr + '$');
  const match = pathname.match(regex);
  if (!match) return null;
  const params: Record<string, string> = {};
  paramNames.forEach((name, i) => {
    params[name] = match[i + 1];
  });
  return params;
}

const routes = [
  { pattern: '/api/admin/comments/[id]/replies', handlers: route0 as any },
  { pattern: '/api/admin/comments/[id]', handlers: route1 as any },
  { pattern: '/api/admin/comments/bulk', handlers: route2 as any },
  { pattern: '/api/admin/login', handlers: route3 as any },
  { pattern: '/api/admin/logout', handlers: route4 as any },
  { pattern: '/api/admin/messages/[id]', handlers: route5 as any },
  { pattern: '/api/admin/music-videos/[id]', handlers: route6 as any },
  { pattern: '/api/admin/music-videos', handlers: route7 as any },
  { pattern: '/api/admin/overview', handlers: route8 as any },
  { pattern: '/api/admin/posts/[id]', handlers: route9 as any },
  { pattern: '/api/admin/posts', handlers: route10 as any },
  { pattern: '/api/admin/replies/[id]', handlers: route11 as any },
  { pattern: '/api/admin/session', handlers: route12 as any },
  { pattern: '/api/admin/settings', handlers: route13 as any },
  { pattern: '/api/admin/users', handlers: route14 as any },
  { pattern: '/api/public/comments/[commentId]/replies', handlers: route15 as any },
  { pattern: '/api/public/contact', handlers: route16 as any },
  { pattern: '/api/public/music-videos/[id]/play', handlers: route17 as any },
  { pattern: '/api/public/music-videos', handlers: route18 as any },
  { pattern: '/api/public/posts/[slug]/comments', handlers: route19 as any },
  { pattern: '/api/public/posts/[slug]/like', handlers: route20 as any },
  { pattern: '/api/public/posts/[slug]', handlers: route21 as any },
  { pattern: '/api/public/posts', handlers: route22 as any },
  { pattern: '/api/public/subscribe', handlers: route23 as any },

];

async function handleRequest(req: Request) {
  try {
    const url = new URL(req.url);
    // Remove trailing slash for exact matching if it exists and path != /
    let pathname = url.pathname;
    if (pathname.endsWith('/') && pathname !== '/') {
      pathname = pathname.slice(0, -1);
    }

    for (const route of routes) {
      const paramsObj = matchPath(route.pattern, pathname);
      if (paramsObj) {
        const method = req.method;
        const handler = route.handlers[method];
        if (handler) {
          const params = Promise.resolve(paramsObj);
          return await handler(req, { params });
        }
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
      }
    }
    return NextResponse.json({ error: 'Not Found: ' + pathname }, { status: 404 });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
