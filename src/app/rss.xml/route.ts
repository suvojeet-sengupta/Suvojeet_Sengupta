import { getDb } from '@/lib/cloudflare';
import { SEO_CONFIG } from '@/lib/seo';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  let posts: Array<{ title: string; slug: string; excerpt: string; published_at: string; category: string }> = [];

  try {
    const db = getDb();
    const result = await db
      .prepare(
        `SELECT title, slug, excerpt, published_at, category
         FROM blogs
         WHERE datetime(published_at) <= CURRENT_TIMESTAMP
         ORDER BY datetime(published_at) DESC
         LIMIT 20`
      )
      .all<{ title: string; slug: string; excerpt: string; published_at: string; category: string }>();
    posts = result.results;
  } catch {
    // DB unavailable — return empty feed rather than error
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SEO_CONFIG.siteName)} — Blog</title>
    <link>${SEO_CONFIG.url}/blog</link>
    <description>${escapeXml(SEO_CONFIG.description)}</description>
    <language>en-IN</language>
    <managingEditor>suvojeet@suvojeetsengupta.in (Suvojeet Sengupta)</managingEditor>
    <webMaster>suvojeet@suvojeetsengupta.in (Suvojeet Sengupta)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <url>${SEO_CONFIG.url}/suvojeet.jpg</url>
      <title>${escapeXml(SEO_CONFIG.siteName)}</title>
      <link>${SEO_CONFIG.url}</link>
    </image>
    <atom:link href="${SEO_CONFIG.url}/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SEO_CONFIG.url}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SEO_CONFIG.url}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt || post.title)}</description>
      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>
      <dc:creator>Suvojeet Sengupta</dc:creator>
      ${post.category ? `<category>${escapeXml(post.category)}</category>` : ''}
    </item>`).join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
