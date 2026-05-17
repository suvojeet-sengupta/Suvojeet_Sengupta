import { getDb } from './cloudflare';
import { mapBlogSummary, mapBlogPost } from './blog-utils';
import { BlogSummary, BlogPost } from '@/types/blog';

export async function getBlogPosts(): Promise<BlogSummary[]> {
  try {
    const db = getDb();
    const queryResult = await db
      .prepare(`
        SELECT
          b.id,
          b.title,
          b.slug,
          b.excerpt,
          b.category,
          b.image_url,
          b.published_at,
          b.views,
          b.likes,
          b.author,
          b.tags,
          b.comments_enabled,
          (
            SELECT COUNT(*)
            FROM comments c
            WHERE c.blog_id = b.id AND c.is_approved = 1
          ) AS comments_count
        FROM blogs b
        WHERE b.published_at <= CURRENT_TIMESTAMP
        ORDER BY datetime(b.published_at) DESC
      `)
      .all<Record<string, unknown>>();

    return queryResult.results.map((row) => mapBlogSummary(row));
  } catch (error) {
    console.error('Error fetching blog posts from DB:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const db = getDb();
    const row = await db
      .prepare(`
        SELECT
          b.id,
          b.title,
          b.slug,
          b.content,
          b.excerpt,
          b.category,
          b.image_url,
          b.published_at,
          b.views,
          b.likes,
          b.author,
          b.tags,
          b.comments_enabled
        FROM blogs b
        WHERE b.slug = ? AND b.published_at <= CURRENT_TIMESTAMP
      `)
      .bind(slug)
      .first<Record<string, unknown>>();

    if (!row) return null;
    return mapBlogPost(row);
  } catch (error) {
    console.error(`Error fetching blog post ${slug} from DB:`, error);
    return null;
  }
}
