import BlogListPage from '@/features/blog/components/BlogListPage';
import { getBlogPosts } from '@/lib/blog-service';

export const runtime = 'edge';

export const metadata = {
  title: 'Blog | Suvojeet Sengupta',
  description: 'Posts, insights, and updates from Suvojeet Sengupta.',
};

export default async function Page() {
  const posts = await getBlogPosts();
  return <BlogListPage initialPosts={posts} />;
}
