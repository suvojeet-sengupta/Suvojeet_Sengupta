import MusicClient from '@/components/music/MusicClient';

export const metadata = {
  title: 'Music | Suvojeet Sengupta',
  description: 'The musical journey and professional profile of Suvojeet Sengupta. Soulful Singer in Hindi and Bengali.',
  openGraph: {
    title: 'Music | Suvojeet Sengupta',
    description: 'Singer • Bengali & Hindi Vocals • Soulful Artist',
    url: 'https://suvojeetsengupta.in/music',
  },
};

export default function Page() {
  return <MusicClient />;
}
