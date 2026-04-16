import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/cloudflare';
import { getClientIp, mapBlogSummary, sha256Hex, toBoolean } from '@/lib/blog-utils';
import { isDashboardSessionActive } from '@/lib/admin-auth';
import { getE2ePostFixture, isE2ePostFixtureSlug } from '@/lib/e2e-fixtures';
import type { BlogComment, BlogPost, BlogReply } from '@/types/blog';
import BlogPostPage from '@/components/blog/BlogPostPage';
import { headers } from 'next/headers';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug || '').trim();

  if (isE2ePostFixtureSlug(slug)) {
    const fixture = getE2ePostFixture();
    return {
      title: `${fixture.title} | Suvojeet Sengupta`,
      description: fixture.excerpt || fixture.title,
    };
  }

  const db = getDb();
  const post = await db
    .prepare('SELECT title, excerpt FROM blogs WHERE slug = ? LIMIT 1')
    .bind(slug)
    .first<Record<string, string>>();

  if (!post) {
    return { title: 'Post Not Found' };
  }

  const title = `${post.title} | Suvojeet Sengupta`;
  const description = post.excerpt || `Read "${post.title}" on Suvojeet Sengupta's blog.`;
  const ogImage = `https://suvojeetsengupta.in/api/og?title=${encodeURIComponent(post.title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://suvojeetsengupta.in/blog/${slug}`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug || '').trim();

  if (!slug) {
    notFound();
  }

  if (isE2ePostFixtureSlug(slug)) {
    return <BlogPostPage post={getE2ePostFixture()} />;
  }

  const db = getDb();
  
  // Get IP and hash for hasLiked check
  const headerList = await headers();
  const cfIp = headerList.get('cf-connecting-ip');
  const forwarded = headerList.get('x-forwarded-for');
  const clientIp = cfIp || (forwarded ? forwarded.split(',')[0].trim() : null);
  const ipHash = clientIp ? await sha256Hex(clientIp) : 'anonymous';

  const postRow = await db
    .prepare(`
      SELECT
        b.id, b.title, b.slug, b.content, b.excerpt, b.category,
        b.image_url, b.published_at, b.views, b.likes, b.author,
        b.tags, b.comments_enabled, b.updated_at,
        CASE
          WHEN datetime(b.published_at) <= CURRENT_TIMESTAMP THEN 1
          ELSE 0
        END AS is_global_live,
        (
          SELECT COUNT(*) FROM comments c
          WHERE c.blog_id = b.id AND c.is_approved = 1
        ) AS comments_count,
        (
          SELECT COUNT(*) FROM blog_likes bl
          WHERE bl.blog_id = b.id AND bl.ip_hash = ?
        ) AS has_liked
      FROM blogs b
      WHERE b.slug = ?
      LIMIT 1
    `)
    .bind(ipHash, slug)
    .first<Record<string, unknown>>();

  if (!postRow) {
    notFound();
  }

  const isGlobalLive = toBoolean(postRow.is_global_live);
  const isAdmin = await isDashboardSessionActive();

  // Hide scheduled posts from public visitors
  if (!isGlobalLive && !isAdmin) {
    notFound();
  }

  const blogId = Number(postRow.id || 0);
  
  // Check if this IP has already viewed this post
  const existingView = await db
    .prepare('SELECT 1 FROM page_views WHERE path = ? AND ip_hash = ? LIMIT 1')
    .bind(`/blog/${slug}`, ipHash)
    .first();

  let isNewView = false;
  if (!existingView) {
    // Only increment view if the IP hasn't seen this path before
    await db.batch([
      db.prepare('UPDATE blogs SET views = COALESCE(views, 0) + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(blogId),
      db.prepare('INSERT INTO page_views (path, ip_hash) VALUES (?, ?)').bind(`/blog/${slug}`, ipHash),
    ]);
    isNewView = true;
  }

  const commentsQuery = await db
    .prepare(`
      SELECT id, blog_id, name, email, content, is_approved, created_at
      FROM comments
      WHERE blog_id = ? AND is_approved = 1
      ORDER BY datetime(created_at) DESC
    `)
    .bind(blogId)
    .all<Record<string, unknown>>();

  const commentIds = commentsQuery.results.map((row) => Number(row.id || 0)).filter(Boolean);
  const repliesByComment = new Map<number, BlogReply[]>();

  if (commentIds.length > 0) {
    const placeholders = commentIds.map(() => '?').join(', ');
    const repliesQuery = await db
      .prepare(`
        SELECT id, comment_id, name, content, is_owner, created_at
        FROM replies
        WHERE comment_id IN (${placeholders})
        ORDER BY datetime(created_at) ASC
      `)
      .bind(...commentIds)
      .all<Record<string, unknown>>();

    for (const row of repliesQuery.results) {
      const commentId = Number(row.comment_id || 0);
      const mappedReply: BlogReply = {
        id: Number(row.id || 0),
        commentId,
        name: String(row.name || ''),
        content: String(row.content || ''),
        isOwner: toBoolean(row.is_owner),
        createdAt: String(row.created_at || ''),
      };

      const existingReplies = repliesByComment.get(commentId) || [];
      existingReplies.push(mappedReply);
      repliesByComment.set(commentId, existingReplies);
    }
  }

  const comments: BlogComment[] = commentsQuery.results.map((row) => {
    const commentId = Number(row.id || 0);
    return {
      id: commentId,
      blogId: Number(row.blog_id || 0),
      name: String(row.name || ''),
      email: typeof row.email === 'string' ? row.email : null,
      content: String(row.content || ''),
      isApproved: toBoolean(row.is_approved),
      createdAt: String(row.created_at || ''),
      replies: repliesByComment.get(commentId) || [],
    };
  });

  const summary = mapBlogSummary(postRow);
  const post: BlogPost = {
    ...summary,
    views: summary.views + (isNewView ? 1 : 0), // Increment locally only if it's a new view
    content: String(postRow.content || ''),
    updatedAt: typeof postRow.updated_at === 'string' ? postRow.updated_at : null,
    comments,
    hasLiked: toBoolean(postRow.has_liked),
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: `https://suvojeetsengupta.in/api/og?title=${encodeURIComponent(post.title)}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author,
      url: 'https://suvojeetsengupta.in',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://suvojeetsengupta.in/blog/${slug}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostPage post={post} />
    </>
  );
}
