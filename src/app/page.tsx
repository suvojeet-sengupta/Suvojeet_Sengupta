import HomePage from '@/components/home/HomePage';

export const metadata = {
  title: 'Suvojeet Sengupta | The Vibe Architect',
  description: 'Product-First Software Engineer, System Architect, and Singer based in India. Specializing in mobile development with Android/Flutter, delivering complex applications with enterprise-grade precision.',
  openGraph: {
    title: 'Suvojeet Sengupta | The Vibe Architect',
    description: 'Singer • Android Vibe Coder • System Architect',
    url: 'https://suvojeetsengupta.in',
    siteName: 'Suvojeet Sengupta',
    images: [
      {
        url: '/suvojeet.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Suvojeet Sengupta | The Vibe Architect',
    description: 'Singer • Android Vibe Coder • System Architect',
  },
};

export default function Page() {
  return <HomePage />;
}
