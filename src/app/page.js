import HomePage from '@/components/home/HomePage';

export const metadata = {
  title: 'Suvojeet Sengupta - Official Website',
  description: 'Welcome to the official website of Suvojeet Sengupta, a talented singer, performer, and composer. Explore his music, biography, and get in touch for collaborations and events.',
  openGraph: {
    title: 'Suvojeet Sengupta - Official Website',
    description: 'Singer • Performer • Composer',
    url: 'https://suvojeetsengupta.com',
    siteName: 'Suvojeet Sengupta',
    images: [
      {
        url: 'https://suvojeetsengupta.com/og-image.jpg', // Replace with actual OG image if available
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function Page() {
  return <HomePage />;
}
