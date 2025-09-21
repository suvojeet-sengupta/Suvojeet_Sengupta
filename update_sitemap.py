import contentful
import os
import argparse
from datetime import datetime

def generate_sitemap(space_id, access_token):
    """
    Generates a sitemap with static URLs and dynamic blog post URLs from Contentful.
    """
    # Initialize Contentful client
    try:
        client = contentful.Client(space_id, access_token)
    except Exception as e:
        print(f"Error initializing Contentful client: {e}")
        return

    # Static URLs
    static_urls = [
        {
            "loc": "https://www.suvojeetsengupta.in/",
            "lastmod": "2025-09-20",
            "changefreq": "daily",
            "priority": "1.0",
        },
        {
            "loc": "https://www.suvojeetsengupta.in/about",
            "lastmod": "2025-09-20",
            "changefreq": "monthly",
            "priority": "0.8",
        },
        {
            "loc": "https://www.suvojeetsengupta.in/music",
            "lastmod": "2025-09-20",
            "changefreq": "weekly",
            "priority": "0.9",
        },
        {
            "loc": "https://www.suvojeetsengupta.in/blog",
            "lastmod": "2025-09-20",
            "changefreq": "weekly",
            "priority": "0.9",
        },
    ]

    # Fetch blog posts from Contentful
    try:
        blog_posts = client.entries({"content_type": "blogPost"})
    except Exception as e:
        print(f"Error fetching blog posts from Contentful: {e}")
        return

    # Start XML sitemap
    sitemap_xml = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
'''

    # Add static URLs to sitemap
    for url in static_urls:
        sitemap_xml += f'''
  <url>
    <loc>{url["loc"]}</loc>
    <lastmod>{url["lastmod"]}</lastmod>
    <changefreq>{url["changefreq"]}</changefreq>
    <priority>{url["priority"]}</priority>
  </url>
'''

    # Add blog post URLs to sitemap
    for post in blog_posts:
        # Assuming the slug is a field in your Contentful blog post model
        slug = post.fields().get("slug")
        if slug:
            post_url = f"https://www.suvojeetsengupta.in/blog/{slug}"
            lastmod = post.updated_at.strftime("%Y-%m-%d")
            sitemap_xml += f'''
  <url>
    <loc>{post_url}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
'''

    # End XML sitemap
    sitemap_xml += '''
</urlset>
'''

    # Write sitemap to file
    try:
        with open("public/sitemap.xml", "w") as f:
            f.write(sitemap_xml)
        print("Sitemap generated successfully!")
    except Exception as e:
        print(f"Error writing sitemap file: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate a sitemap for the website.")
    parser.add_argument("--space-id", required=True, help="Contentful space ID")
    parser.add_argument("--access-token", required=True, help="Contentful access token")
    args = parser.parse_args()

    generate_sitemap(args.space_id, args.access_token)