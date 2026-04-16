import { NextRequest } from 'next/server';

export const runtime = 'edge';

/**
 * Lightweight SVG-based OG Image Generator
 * Replaces next/og to keep bundle size under 3MB limit on Cloudflare Free Plan.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'Suvojeet Sengupta';
    
    // Basic SVG sanitization
    const safeTitle = title
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    // Minimal high-performance SVG template
    const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0d0d0d;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#grad)"/>
      
      <!-- Accent Border -->
      <rect x="0" y="610" width="1200" height="20" fill="#f97316"/>
      
      <!-- Logo Mark -->
      <rect x="80" y="80" width="12" height="40" fill="#f97316"/>
      <text x="107" y="112" font-family="sans-serif" font-size="28" font-weight="bold" fill="white" style="letter-spacing: 2px;">SUVOJEET SENGUPTA</text>
      
      <!-- Dynamic Title (Simple Wrapping Logic) -->
      <text x="80" y="280" font-family="sans-serif" font-size="64" font-weight="900" fill="white">
        ${safeTitle.length > 50 ? safeTitle.substring(0, 47) + '...' : safeTitle}
      </text>
      
      <!-- Footer -->
      <text x="80" y="550" font-family="sans-serif" font-size="24" fill="#888">Read more at suvojeetsengupta.in</text>
      
      <!-- Decorative Element -->
      <circle cx="1100" cy="100" r="150" fill="#f97316" fill-opacity="0.05" />
    </svg>
    `.trim();

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, s-maxage=31536000',
      },
    });
  } catch (e: any) {
    console.error('OG Generation Error:', e);
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
