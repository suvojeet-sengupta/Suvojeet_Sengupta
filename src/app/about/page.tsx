import AboutClient from '@/components/about/AboutClient';
import { Metadata } from 'next';
import { SEO_CONFIG, getOgImageUrl } from '@/lib/seo';

const ogImage = getOgImageUrl('About Me', { subtitle: 'Singer • Creative Developer • Bengali & Hindi Vocals' });

export const metadata: Metadata = {
  title: 'About | Suvojeet Sengupta',
  description: 'Learn about Suvojeet Sengupta, a soulful Singer and Creative Developer from Asansol, West Bengal. Inspired by Kishore Kumar and Arijit Singh.',
  openGraph: {
    title: 'About | Suvojeet Sengupta',
    description: 'Singer • Creative Developer • Bengali & Hindi Vocals',
    url: `${SEO_CONFIG.url}/about`,
    type: 'profile',
    images: [{ url: ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | Suvojeet Sengupta',
    description: 'Singer • Creative Developer • Bengali & Hindi Vocals',
    images: [ogImage],
  },
};

export default function Page() {
  return <AboutClient />;
}
