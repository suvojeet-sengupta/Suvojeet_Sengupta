import AboutClient from '@/components/about/AboutClient';
import { Metadata } from 'next';
import { SEO_CONFIG, getOgImageUrl, getBreadcrumbJsonLd } from '@/lib/seo';

const ogImage = getOgImageUrl('About Me', { subtitle: 'Vibe Architect • Logic Implementer • Soulful Singer' });

export const metadata: Metadata = {
  title: 'About | Suvojeet Sengupta',
  description: 'Learn about Suvojeet Sengupta, a soulful Singer and Vibe Architect. Not a traditional coder, but a logic-driven implementer using AI to build high-performance digital experiences.',
  openGraph: {
    title: 'About | Suvojeet Sengupta',
    description: 'Vibe Architect • Logic Implementer • Soulful Singer',
    url: `${SEO_CONFIG.url}/about`,
    type: 'profile',
    images: [{ url: ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | Suvojeet Sengupta',
    description: 'Vibe Architect • Logic Implementer • Soulful Singer',
    images: [ogImage],
  },
};

export default function Page() {
  const breadcrumb = getBreadcrumbJsonLd([
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <AboutClient />
    </>
  );
}
