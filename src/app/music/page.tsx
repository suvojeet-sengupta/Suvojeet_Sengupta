import MusicClient from '@/components/music/MusicClient';
import { Metadata } from 'next';
import { SEO_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Music | Suvojeet Sengupta',
  description: 'The musical journey and professional profile of Suvojeet Sengupta. Soulful Singer in Hindi and Bengali.',
  openGraph: {
    title: 'Music | Suvojeet Sengupta',
    description: 'Singer • Bengali & Hindi Vocals • Soulful Artist',
    url: `${SEO_CONFIG.url}/music`,
    type: 'website',
  },
};

export default function Page() {
  return <MusicClient />;
}
