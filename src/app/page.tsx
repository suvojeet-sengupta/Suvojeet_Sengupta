import HomePage from '@/components/home/HomePage';

export const metadata = {
  title: 'Suvojeet Sengupta | Singer & Creative Developer',
  description: 'Soulful Singer in Hindi & Bengali inspired by Arijit Singh & Kishore Kumar. Professional Android Developer building high-performance solutions.',
  openGraph: {
    title: 'Suvojeet Sengupta | Singer & Developer',
    description: 'Arijit Singh & Kishore Kumar inspired Singer • Android Dev • Bengali & Hindi Vocals',
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
    title: 'Suvojeet Sengupta | Singer & Developer',
    description: 'Singer • Bengali & Hindi Vocals • Android Developer',
  },
};

export default function Page() {
  return <HomePage />;
}
