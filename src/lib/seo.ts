// =====================================================
// IMPROVED seo.ts - Enhanced for Rich Google Results
// =====================================================

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
    "Suvojeet Sengupta", "Vibe Architect", "Suvojeet Singer",
    "AI-Driven Developer", "Logic Implementer", "Soulful Singer Dhanbad",
    "Bengali Singer Dhanbad", "Hindi Singer Dhanbad", "Kishore Kumar Tribute",
    "Arijit Singh Style", "SuvMusic", "NoteNext App",
    "Android Developer India", "Creative Technologist", "Burnpur Singer",
    "Dhanbad Musician", "Full Stack Developer Singer"
  ],
  socials: {
    github: "https://github.com/suvojeet-sengupta",
    linkedin: "https://linkedin.com/in/suvojeet-sengupta",
    instagram: "https://instagram.com/suvojeet__sengupta",
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

/** Enhanced Person Schema (Knowledge Panel ke liye best) */
export function getEnhancedPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SEO_CONFIG.url}/#person`,
    name: "Suvojeet Sengupta",
    alternateName: ["Suvojeet", "Suvojeet Singer", "Vibe Architect"],
    url: SEO_CONFIG.url,
    image: `${SEO_CONFIG.url}/suvojeet.jpg`,
    jobTitle: ["Vibe Architect", "Software Engineer", "Singer & Performer", "Creative Developer"],
    description: SEO_CONFIG.description,
    knowsAbout: [
      "Android Architecture", "AI-Assisted Development", "Prompt Engineering",
      "Custom ROMs", "Hindi & Bengali Singing", "Music Composition",
      "UI/UX Design", "Full-Stack Web Development"
    ],
    alumniOf: { "@type": "EducationalOrganization", name: "Asansol Engineering College" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhanbad", addressRegion: "Jharkhand", addressCountry: "IN"
    },
    sameAs: Object.values(SEO_CONFIG.socials),
    performerIn: {
      "@type": "MusicGroup",
      name: "Suvojeet Sengupta",
      genre: ["Bollywood", "Bengali Modern", "Soul", "Patriotic", "Indian Classical Covers"]
    }
  };
}

/** Music Schema */
export function getMusicSchema(songTitle?: string) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "@id": `${SEO_CONFIG.url}/#music`,
    name: "Suvojeet Sengupta",
    url: SEO_CONFIG.url,
    image: `${SEO_CONFIG.url}/suvojeet.jpg`,
    genre: ["Hindi Singing", "Bengali Singing", "Bollywood Covers", "Soulful Music", "Patriotic Songs"],
    member: { "@type": "Person", name: "Suvojeet Sengupta" },
    sameAs: [SEO_CONFIG.socials.youtube, SEO_CONFIG.socials.instagram]
  };
  if (songTitle) {
    schema["@type"] = ["MusicGroup", "MusicRecording"];
    schema.name = songTitle;
    schema.description = `Soulful cover of ${songTitle} performed by Suvojeet Sengupta`;
  }
  return schema;
}

/** Project Schema (SuvMusic / NoteNext) */
export function getProjectSchema(projectName: string, description: string, projectUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: projectName,
    description,
    url: projectUrl,
    applicationCategory: ["DeveloperApplication", "MusicApplication"],
    operatingSystem: "Android, Web, Cross-platform",
    author: { "@type": "Person", name: "Suvojeet Sengupta", url: SEO_CONFIG.url },
    creator: { "@type": "Person", name: "Suvojeet Sengupta" }
  };
}

/** FAQ Schema */
export function getFAQSchema(faqs: Array<{question: string, answer: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer }
    }))
  };
}
