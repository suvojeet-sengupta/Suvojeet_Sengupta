import MusicClient from '@/components/music/MusicClient';
import { Metadata } from 'next';
import { SEO_CONFIG, getOgImageUrl } from '@/lib/seo';

const ogImage = getOgImageUrl('My Music', { subtitle: 'Bengali & Hindi Vocals • Soulful Artist' });

export const metadata: Metadata = {
  title: 'Music | Suvojeet Sengupta',
  description: 'The musical journey and professional profile of Suvojeet Sengupta. Soulful Singer in Hindi and Bengali.',
  openGraph: {
    title: 'Music | Suvojeet Sengupta',
    description: 'Singer • Bengali & Hindi Vocals • Soulful Artist',
    url: `${SEO_CONFIG.url}/music`,
    type: 'website',
    images: [{ url: ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Music | Suvojeet Sengupta',
    description: 'Singer • Bengali & Hindi Vocals • Soulful Artist',
    images: [ogImage],
  },
};

export default function Page() {
  return <MusicClient />;
}
