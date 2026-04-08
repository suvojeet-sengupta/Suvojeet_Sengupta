import MusicClient from '@/components/music/MusicClient';

export const metadata = {
  title: 'Music | Suvojeet Sengupta',
  description: 'The musical journey and professional profile of Suvojeet Sengupta. Exploring the soul of music and the rhythm of life.',
  openGraph: {
    title: 'Music | Suvojeet Sengupta',
    description: 'Singer • Musician • The Vibe Architect',
    url: 'https://suvojeetsengupta.in/music',
  },
};

export default function Page() {
  return <MusicClient />;
}
