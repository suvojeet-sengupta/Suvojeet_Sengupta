import HomePage from '@/components/home/HomePage';
import { Metadata } from 'next';
import { SEO_CONFIG, getOgImageUrl } from '@/lib/seo';
import FeaturedProjects, { FeaturedProjectsSkeleton } from '@/components/home/FeaturedProjects';
import { Suspense } from 'react';

const ogImage = getOgImageUrl('Suvojeet Sengupta', { subtitle: 'Vibe Architect & Soulful Singer' });

export const metadata: Metadata = {
  title: SEO_CONFIG.title,
  description: SEO_CONFIG.description,
  keywords: SEO_CONFIG.keywords,
  alternates: { canonical: SEO_CONFIG.url },
  openGraph: {
    title: SEO_CONFIG.title,
    description: SEO_CONFIG.description,
    url: SEO_CONFIG.url,
    siteName: SEO_CONFIG.siteName,
    images: [{ url: ogImage, width: 1200, height: 630, alt: 'Suvojeet Sengupta — Vibe Architect & Soulful Singer' }],
    locale: SEO_CONFIG.locale,
    type: 'profile',
    // @ts-ignore — profile open graph fields
    'profile:first_name': 'Suvojeet',
    'profile:last_name': 'Sengupta',
    'profile:username': 'suvojeet-sengupta',
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_CONFIG.title,
    description: SEO_CONFIG.description,
    images: [ogImage],
    creator: SEO_CONFIG.twitterHandle,
    site: SEO_CONFIG.twitterSite,
  },
};

export default function Page() {
  return (
    <HomePage>
      <Suspense fallback={<FeaturedProjectsSkeleton />}>
        <FeaturedProjects />
      </Suspense>
    </HomePage>
  );
}
