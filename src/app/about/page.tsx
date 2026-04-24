import AboutClient from '@/components/about/AboutClient';
import { Metadata } from 'next';
import { SEO_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About | Suvojeet Sengupta',
  description: 'Learn about Suvojeet Sengupta, a soulful Singer and Creative Developer from Asansol, West Bengal. Inspired by Kishore Kumar and Arijit Singh.',
  openGraph: {
    title: 'About | Suvojeet Sengupta',
    description: 'Singer • Creative Developer • Bengali & Hindi Vocals',
    url: `${SEO_CONFIG.url}/about`,
    type: 'profile',
  },
};

export default function Page() {
  return <AboutClient />;
}
