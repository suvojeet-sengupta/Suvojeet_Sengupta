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
  description: "Official portfolio of Suvojeet Sengupta. A soulful singer in Hindi and Bengali, inspired by Kishore Kumar and Arijit Singh. Also a high-performance Android Developer and UI/UX enthusiast.",
  siteName: "Suvojeet Sengupta",
  url: "https://suvojeetsengupta.in",
  twitterHandle: "@suvojeet_s",
  locale: "en_IN",
  keywords: [
    "Suvojeet Sengupta",
    "Suvojeet Singer",
    "Suvojeet Sengupta Singer",
    "Suvojeet Sengupta Developer",
    "Android Developer India",
    "Bengali Singer Dhanbad",
    "Hindi Singer Dhanbad",
    "Kishore Kumar Cover Artist",
    "Arijit Singh Cover Artist",
    "SuvMusic Developer",
    "NoteNext Android App",
    "Suvojeet Sengupta Portfolio",
    "Creative Developer West Bengal",
    "Burnpur Singer",
  ],
  socials: {
    github: "https://github.com/suvojeet-sengupta",
    linkedin: "https://linkedin.com/in/suvojeet-sengupta",
    instagram: "https://instagram.com/suvojeet_sengupta",
    youtube: "https://youtube.com/@suvojeetsengupta",
    twitter: "https://twitter.com/suvojeet_s",
  }
};

export function getBreadcrumbJsonLd(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SEO_CONFIG.url}${item.item.startsWith('/') ? item.item : `/${item.item}`}`,
    })),
  };
}
