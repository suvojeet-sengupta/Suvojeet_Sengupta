import { Metadata } from 'next';
import ContactClient from '@/components/contact/ContactClient';
import { SEO_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contact | Suvojeet Sengupta',
  description: 'Get in touch with Suvojeet Sengupta for projects, song requests, or collaborations. Based in India, available globally.',
  openGraph: {
    title: 'Contact | Suvojeet Sengupta',
    description: 'Get in touch for projects, song requests, or collaborations.',
    url: `${SEO_CONFIG.url}/contact`,
    type: 'website',
  },
};

export default function Page() {
  return <ContactClient />;
}
