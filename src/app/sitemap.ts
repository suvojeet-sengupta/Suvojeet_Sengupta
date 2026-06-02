import { MetadataRoute } from 'next';
import { getDb } from '@/lib/cloudflare';
import { SEO_CONFIG } from '@/lib/seo';

export const runtime = 'edge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = getDb();
  
  // Static routes with individual priorities
  const staticPages = [
    { path: '',         priority: 1.0, freq: 'daily'   as const },
    { path: '/about',   priority: 0.9, freq: 'weekly'  as const },
    { path: '/music',   priority: 0.9, freq: 'weekly'  as const },
    { path: '/blog',    priority: 0.9, freq: 'daily'   as const },
    { path: '/contact', priority: 0.8, freq: 'monthly' as const },
    { path: '/suvmusic',priority: 0.8, freq: 'monthly' as const },
    { path: '/notenext',priority: 0.8, freq: 'monthly' as const },
  ];

  const routes = staticPages.map(({ path, priority, freq }) => ({
    url: `${SEO_CONFIG.url}${path}`,
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
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
