import MusicClient from '@/components/music/MusicClient';
import { Metadata } from 'next';
import { SEO_CONFIG, getOgImageUrl, getBreadcrumbJsonLd, getMusicSchema } from '@/lib/seo';
import { getMusicVideos } from '@/lib/music-service';

export const runtime = 'edge';

const ogImage = getOgImageUrl('My Music');

export const metadata: Metadata = {
  title: 'Music',
  description: 'Hindi and Bengali songs by Suvojeet Sengupta: recordings, covers and live performances.',
  openGraph: {
    title: 'Music | Suvojeet Sengupta',
    description: 'Hindi and Bengali songs by Suvojeet Sengupta, recorded and performed live.',
    url: `${SEO_CONFIG.url}/music`,
    type: 'website',
    images: [{ url: ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Music | Suvojeet Sengupta',
    description: 'Hindi and Bengali songs by Suvojeet Sengupta, recorded and performed live.',
    images: [ogImage],
  },
};

export default async function Page() {
  const videos = await getMusicVideos();
  const breadcrumb = getBreadcrumbJsonLd([
    { name: 'Home', item: '/' },
    { name: 'Music', item: '/music' },
  ]);
  const musicSchema = getMusicSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(musicSchema) }}
      />
      <MusicClient initialVideos={videos} />
    </>
  );
}
