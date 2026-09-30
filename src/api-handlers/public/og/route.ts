import { NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api-base';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text') || searchParams.get('title');

    if (!text) {
      return NextResponse.json({ error: 'text parameter is required' }, { status: 400 });
    }

    const targetBase = process.env.NEXT_PUBLIC_OG_IMAGE_URL || API_BASE || 'https://api.suvojeetsengupta.in';
    const cleanBase = targetBase.replace(/\/+$/, '');
    const remoteUrl = `${cleanBase}/api/public/og?${new URLSearchParams({ text })}`;

    // Fetch OG image from backend API server
    const backendRes = await fetch(remoteUrl);
    if (!backendRes.ok) {
      return NextResponse.json({ error: 'Failed to generate OG image' }, { status: backendRes.status });
    }

    const imageBuffer = await backendRes.arrayBuffer();
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': backendRes.headers.get('Content-Type') || 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      },
    });
  } catch (error: any) {
    console.error('OG API Route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
