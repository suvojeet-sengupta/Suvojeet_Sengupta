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
  title: "Suvojeet Sengupta | Vibe Architect & Soulful Singer",
  description: "Official portfolio of Suvojeet Sengupta. A soulful singer in Hindi and Bengali, and a Vibe Architect who builds logic-driven experiences using AI. Not a traditional coder, but an architect of high-performance digital vibes.",
  siteName: "Suvojeet Sengupta",
  url: "https://suvojeetsengupta.in",
  twitterHandle: "@suvojeet_s",
  locale: "en_IN",
  keywords: [
    "Suvojeet Sengupta",
    "Vibe Architect",
    "Suvojeet Singer",
    "AI-Driven Developer",
    "Logic Implementer",
    "Soulful Singer Dhanbad",
    "Bengali Singer Dhanbad",
    "Hindi Singer Dhanbad",
    "Kishore Kumar Tribute",
    "Arijit Singh Style",
    "SuvMusic Vibe Architect",
    "NoteNext App Architect",
    "Suvojeet Sengupta Portfolio",
    "Creative Architect West Bengal",
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
