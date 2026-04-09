import AboutClient from '@/components/about/AboutClient';

export const metadata = {
  title: 'About | Suvojeet Sengupta',
  description: 'Learn about Suvojeet Sengupta, a soulful Singer and Creative Developer from Asansol, West Bengal. Inspired by Kishore Kumar and Arijit Singh.',
  openGraph: {
    title: 'About | Suvojeet Sengupta',
    description: 'Singer • Creative Developer • Bengali & Hindi Vocals',
    url: 'https://suvojeetsengupta.in/about',
  },
};

export default function Page() {
  return <AboutClient />;
}
