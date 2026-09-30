import AboutClient from '@/components/about/AboutClient';
import { Metadata } from 'next';
import { SEO_CONFIG, getOgImageUrl, getBreadcrumbJsonLd, getFAQSchema, getProfilePageSchema } from '@/lib/seo';

const ogImage = getOgImageUrl('About Me');

export const metadata: Metadata = {
  title: 'About',
  description: 'Suvojeet Sengupta is a software developer intern at gOGig and a Hindi & Bengali vocalist from Dhanbad, India. Experience, skills and background.',
  keywords: [
    'Suvojeet Sengupta', 'about Suvojeet Sengupta', 'software developer Dhanbad',
    'backend developer India', 'Android developer', 'Hindi singer', 'Bengali singer', 'Suvojeet Sengupta résumé'
  ],
  alternates: { canonical: `${SEO_CONFIG.url}/about` },
  openGraph: {
    title: 'About | Suvojeet Sengupta',
    description: 'Suvojeet Sengupta is a software developer intern at gOGig and a Hindi & Bengali vocalist from Dhanbad, India. Experience, skills and background.',
    url: `${SEO_CONFIG.url}/about`,
    type: 'profile',
    images: [{ url: ogImage, width: 1200, height: 630, alt: 'Suvojeet Sengupta' }],
    // @ts-ignore
    'profile:first_name': 'Suvojeet',
    'profile:last_name': 'Sengupta',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | Suvojeet Sengupta',
    description: 'Suvojeet Sengupta is a software developer intern at gOGig and a Hindi & Bengali vocalist from Dhanbad, India. Experience, skills and background.',
    images: [ogImage],
    creator: SEO_CONFIG.twitterHandle,
    site: SEO_CONFIG.twitterSite,
  },
};

export default function Page() {
  const breadcrumb = getBreadcrumbJsonLd([
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' },
  ]);

  const faqSchema = getFAQSchema([
    {
      question: "Who is Suvojeet Sengupta?",
      answer: "Suvojeet Sengupta is a software developer and Hindi & Bengali vocalist based in Dhanbad, India. He is a software developer intern at gOGig, where he works on Android app development, web and backend, and records and performs music."
    },
    {
      question: "What has Suvojeet Sengupta built?",
      answer: "SuvMusic, a YouTube Music client for Android with more than 290 GitHub stars; NoteNext, an offline-first Android notes app with biometric lock; custom ROM builds for the Redmi 12 5G / Poco M6 Pro 5G; and suvojeetsengupta.in with its own NestJS backend API."
    },
    {
      question: "What technologies does Suvojeet Sengupta work with?",
      answer: "Kotlin and Jetpack Compose for Android; TypeScript, Node.js and NestJS for backend services; Next.js and React for the web; and Docker and Cloudflare for deployment."
    },
    {
      question: "What are Suvojeet's musical influences?",
      answer: "Kishore Kumar, Lata Mangeshkar and Arijit Singh. He sings in Hindi and Bengali."
    }
  ]);

  const profilePageSchema = getProfilePageSchema();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <AboutClient />
    </>
  );
}
