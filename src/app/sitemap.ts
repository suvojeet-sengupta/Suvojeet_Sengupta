import { MetadataRoute } from 'next';
import { getDb } from '@/lib/cloudflare';
import { SEO_CONFIG } from '@/lib/seo';

export const runtime = 'edge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = getDb();
  
  // Static routes
  const routes = [
    '',
    '/about',
    '/music',
    '/blog',
    '/contact',
  ].map((route) => ({
    url: `${SEO_CONFIG.url}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic blog routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogs = await db
      .prepare('SELECT slug, updated_at, published_at FROM blogs WHERE datetime(published_at) <= CURRENT_TIMESTAMP')
      .all<Record<string, string>>();

    blogRoutes = blogs.results.map((post) => ({
      url: `${SEO_CONFIG.url}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.published_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
  }

  return [...routes, ...blogRoutes];
}
