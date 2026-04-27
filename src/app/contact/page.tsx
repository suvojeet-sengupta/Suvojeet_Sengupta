import { Metadata } from 'next';
import ContactClient from '@/components/contact/ContactClient';
import { SEO_CONFIG, getOgImageUrl } from '@/lib/seo';

const ogImage = getOgImageUrl('Get In Touch', { subtitle: 'Projects • Song Requests • Collaborations' });

export const metadata: Metadata = {
  title: 'Contact | Suvojeet Sengupta',
  description: 'Get in touch with Suvojeet Sengupta for projects, song requests, or collaborations. Based in India, available globally.',
  openGraph: {
    title: 'Contact | Suvojeet Sengupta',
    description: 'Get in touch for projects, song requests, or collaborations.',
    url: `${SEO_CONFIG.url}/contact`,
    type: 'website',
    images: [{ url: ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | Suvojeet Sengupta',
    description: 'Get in touch for projects, song requests, or collaborations.',
    images: [ogImage],
  },
};

export default function Page() {
  return <ContactClient />;
}
