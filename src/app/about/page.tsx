import AboutClient from '@/components/about/AboutClient';
import { Metadata } from 'next';
import { SEO_CONFIG, getOgImageUrl, getBreadcrumbJsonLd, getFAQSchema } from '@/lib/seo';

const ogImage = getOgImageUrl('About Me', { subtitle: 'Vibe Architect • Logic Implementer • Soulful Singer' });

export const metadata: Metadata = {
  title: 'About | Suvojeet Sengupta',
  description: 'Suvojeet Sengupta understands architecture, thinks in systems, and solves real problems — without writing code manually. AI is the implementation layer. Production thinking is the skill.',
  openGraph: {
    title: 'About | Suvojeet Sengupta',
    description: 'Vibe Architect • Logic Implementer • Soulful Singer',
    url: `${SEO_CONFIG.url}/about`,
    type: 'profile',
    images: [{ url: ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | Suvojeet Sengupta',
    description: 'Vibe Architect • Logic Implementer • Soulful Singer',
    images: [ogImage],
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
      answer: "Suvojeet Sengupta is a Vibe Architect, Logic Implementer, and soulful Singer based in Dhanbad, India. He builds production-grade software by thinking in complete systems and using AI as his implementation layer — without writing code manually."
    },
    {
      question: "Does Suvojeet Sengupta write code?",
      answer: "Not in the traditional sense. Suvojeet designs the full system architecture — data flow, performance constraints, failure modes, and component contracts — then directs AI to implement it. The logic, the decisions, and the production thinking are entirely his. The syntax is the machine's job."
    },
    {
      question: "What is a Vibe Architect?",
      answer: "A Vibe Architect is someone who understands systems deeply enough to design them completely before building. Suvojeet thinks in architecture, plans for production from day one, and uses AI as a precision implementation tool — not a replacement for thinking."
    },
    {
      question: "What has Suvojeet Sengupta built?",
      answer: "SuvMusic — a high-performance YouTube Music client for Android with 200+ GitHub stars; NoteNext — an offline-first note app with biometric privacy; and official Custom ROM builds for Redmi 12 5G / Poco M6 Pro 5G used by real communities."
    },
    {
      question: "What are Suvojeet's musical influences?",
      answer: "Suvojeet is inspired by Kishore Kumar, Lata Mangeshkar, and modern artists like Arijit Singh. He performs in Hindi and Bengali, approaching every song with the same precision and intentionality he brings to software design."
    }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AboutClient />
    </>
  );
}
