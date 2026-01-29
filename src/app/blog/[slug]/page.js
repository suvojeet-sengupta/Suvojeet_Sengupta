import BlogPostClient from "@/components/blog/BlogPostClient";
import client from "@/services/contentful";

export async function generateMetadata({ params }) {
    const { slug } = await params;

    try {
        const response = await client.getEntries({
            content_type: 'blogPost',
            'fields.slug': slug,
            limit: 1,
        });

        if (response.items.length > 0) {
            const post = response.items[0];
            const imageUrl = post.fields.coverImage?.fields?.file?.url
                ? `https:${post.fields.coverImage.fields.file.url}`
                : null;

            return {
                title: `${post.fields.title} | Suvojeet Sengupta`,
                description: post.fields.excerpt,
                openGraph: {
                    title: post.fields.title,
                    description: post.fields.excerpt,
                    images: imageUrl ? [{ url: imageUrl }] : [],
                    type: 'article',
                },
                twitter: {
                    card: 'summary_large_image',
                    title: post.fields.title,
                    description: post.fields.excerpt,
                    images: imageUrl ? [imageUrl] : [],
                },
            };
        }
    } catch (error) {
        console.error("Error fetching post metadata:", error);
    }

    return {
        title: 'Blog Post Not Found',
    };
}

export default function BlogPostPage() {
    return <BlogPostClient />;
}
