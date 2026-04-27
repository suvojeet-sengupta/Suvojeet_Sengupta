import HomePage from '@/components/home/HomePage';
import { Metadata } from 'next';
import { SEO_CONFIG, getOgImageUrl } from '@/lib/seo';
import FeaturedProjects, { FeaturedProjectsSkeleton } from '@/components/home/FeaturedProjects';
import { Suspense } from 'react';

const ogImage = getOgImageUrl('Suvojeet Sengupta', { subtitle: 'Singer & Creative Developer' });

export const metadata: Metadata = {
  title: SEO_CONFIG.title,
  description: SEO_CONFIG.description,
  openGraph: {
    title: SEO_CONFIG.title,
    description: SEO_CONFIG.description,
    url: SEO_CONFIG.url,
    siteName: SEO_CONFIG.siteName,
    images: [{ url: ogImage, width: 1200, height: 630, alt: SEO_CONFIG.siteName }],
    locale: SEO_CONFIG.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_CONFIG.title,
    description: SEO_CONFIG.description,
    images: [ogImage],
    creator: SEO_CONFIG.twitterHandle,
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
