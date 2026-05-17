import BlogListPage from '@/features/blog/components/BlogListPage';
import { getBlogPosts } from '@/lib/blog-service';
import { getBreadcrumbJsonLd } from '@/lib/seo';

export const runtime = 'edge';

export const metadata = {
  title: 'Blog | Suvojeet Sengupta',
  description: 'Posts, insights, and updates from Suvojeet Sengupta.',
};

export default async function Page() {
  const posts = await getBlogPosts();
  const breadcrumb = getBreadcrumbJsonLd([
    { name: 'Home', item: '/' },
    { name: 'Blog', item: '/blog' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <BlogListPage initialPosts={posts} />
    </>
  );
}
