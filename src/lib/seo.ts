export function getOgImageUrl(
  title: string,
  options: { subtitle?: string; category?: string } = {}
): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL;
  if (!base) return '/suvojeet.jpg';
  const params = new URLSearchParams({ title });
  if (options.subtitle) params.set('subtitle', options.subtitle);
  if (options.category) params.set('category', options.category);
  return `${base}/og-image?${params}`;
}

export const SEO_CONFIG = {
  title: "Suvojeet Sengupta | Singer & Creative Developer",
  description: "Official portfolio of Suvojeet Sengupta. A soulful singer in Hindi and Bengali, inspired by Kishore Kumar and Arijit Singh. Also a high-performance Android Developer.",
  siteName: "Suvojeet Sengupta",
  url: "https://www.suvojeetsengupta.in",
  twitterHandle: "@suvojeet_sengupta", // Based on instagram/socials, assuming same
  locale: "en_IN",
  keywords: [
    "Suvojeet Sengupta",
    "Singer",
    "Bengali Singer",
    "Hindi Singer",
    "Android Developer",
    "SuvMusic",
    "NoteNext",
    "Asansol Singer",
    "Kishore Kumar Tribute",
    "Arijit Singh Style",
    "Full Stack Developer",
  ],
};
