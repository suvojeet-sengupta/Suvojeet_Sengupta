// =====================================================
// seo.ts — Maximum Google visibility
// =====================================================

export function getOgImageUrl(
  title: string,
  options: { subtitle?: string; category?: string } = {}
): string {
  let base = process.env.NEXT_PUBLIC_OG_IMAGE_URL;
  if (!base) return '/suvojeet.jpg';
  if (base.endsWith('/')) {
    base = base.slice(0, -1);
  }
  const params = new URLSearchParams({ title });
  if (options.subtitle) params.set('subtitle', options.subtitle);
  if (options.category) params.set('category', options.category);
  return `${base}/og-image?${params}`;
}

export const SEO_CONFIG = {
  title: "Suvojeet Sengupta | Singer | Performer | Composer | Tech Enthusiast | Lifelong Learner | Android App Architect | Web & Backend Developer | AI Power User | Problem Solver",
  description: "Official portfolio of Suvojeet Sengupta — Singer, Performer, Composer, Tech Enthusiast, Lifelong Learner, Android App Architect, Web & Backend Developer, AI Power User & Problem Solver from Dhanbad, India.",
  siteName: "Suvojeet Sengupta",
  url: "https://suvojeetsengupta.in",
  twitterHandle: "@suvojeet_s",
  twitterSite: "@suvojeet_s",
  locale: "en_IN",
  keywords: [
    "Suvojeet Sengupta",
    "Singer",
    "Performer",
    "Composer",
    "Tech Enthusiast",
    "Lifelong Learner",
    "Android App Architect",
    "Web & Backend Developer",
    "AI Power User",
    "Problem Solver",
    "Suvojeet Sengupta singer",
    "Suvojeet Sengupta developer",
    "Android App Architect India",
    "Full Stack Developer Dhanbad",
    "Soulful Singer India",
    "SuvMusic app",
    "NoteNext app",
    "AI software developer India",
    "suvojeetsengupta.in"
  ],
  socials: {
    github: "https://github.com/suvojeet-sengupta",
    linkedin: "https://linkedin.com/in/suvojeet-sengupta",
    instagram: "https://instagram.com/suvojeet__sengupta",
    youtube: "https://youtube.com/@suvojeetsengupta",
    twitter: "https://twitter.com/suvojeet_s",
    facebook: "https://facebook.com/suvojeetsengupta21",
  }
};

// ─── Breadcrumb ────────────────────────────────────────────
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

// ─── Person Schema (Google Knowledge Panel) ────────────────
export function getEnhancedPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SEO_CONFIG.url}/#person`,
    name: "Suvojeet Sengupta",
    givenName: "Suvojeet",
    familyName: "Sengupta",
    alternateName: ["Suvojeet", "Suvojeet Singer", "Vibe Architect", "Suvojeet Sengupta Singer"],
    url: SEO_CONFIG.url,
    image: {
      "@type": "ImageObject",
      url: `${SEO_CONFIG.url}/suvojeet.jpg`,
      width: 1200,
      height: 630,
    },
    birthDate: "2005-08-01",
    birthPlace: {
      "@type": "Place",
      name: "Burnpur, Asansol, West Bengal, India",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Asansol",
        addressRegion: "West Bengal",
        addressCountry: "IN",
      }
    },
    homeLocation: {
      "@type": "Place",
      name: "Dhanbad, Jharkhand, India",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dhanbad",
        addressRegion: "Jharkhand",
        addressCountry: "IN",
      }
    },
    nationality: {
      "@type": "Country",
      name: "India"
    },
    knowsLanguage: ["Hindi", "Bengali", "English"],
    jobTitle: "Singer | Performer | Composer | Tech Enthusiast | Lifelong Learner | Android App Architect | Web & Backend Developer | AI Power User | Problem Solver",
    hasOccupation: [
      {
        "@type": "Occupation",
        name: "Singer, Performer & Composer",
        description: "Vocalist and music creator performing soulful Hindi and Bengali music, compositions, and live performances.",
        occupationLocation: { "@type": "Country", name: "India" }
      },
      {
        "@type": "Occupation",
        name: "Android App Architect & Web & Backend Developer",
        description: "Architects mobile Android applications and modern full-stack web and backend software architectures.",
        occupationLocation: { "@type": "Country", name: "India" }
      },
      {
        "@type": "Occupation",
        name: "AI Power User & Problem Solver",
        description: "Utilizes advanced AI tools and structured problem-solving methodologies for high-performance software engineering.",
        occupationLocation: { "@type": "Country", name: "India" }
      }
    ],
    description: SEO_CONFIG.description,
    knowsAbout: [
      "Singer & Vocalist",
      "Music Performance & Composition",
      "Android App Architecture",
      "Kotlin & Jetpack Compose",
      "Web & Backend Development",
      "Node.js & Next.js",
      "Cloudflare Workers & APIs",
      "AI-Driven Engineering & Systems Architecture",
      "Problem Solving & Tech Innovation",
      "Lifelong Learning"
    ],
    sameAs: Object.values(SEO_CONFIG.socials),
    mainEntityOfPage: {
      "@type": "ProfilePage",
      "@id": `${SEO_CONFIG.url}/about`
    }
  };
}

// ─── ProfilePage Schema (About page) ───────────────────────
export function getProfilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SEO_CONFIG.url}/about`,
    url: `${SEO_CONFIG.url}/about`,
    name: "About Suvojeet Sengupta",
    description: "The personal and professional profile of Suvojeet Sengupta — Vibe Architect, Logic Implementer, and Soulful Singer from Dhanbad, India.",
    dateModified: new Date().toISOString(),
    mainEntity: {
      "@type": "Person",
      "@id": `${SEO_CONFIG.url}/#person`,
      name: "Suvojeet Sengupta",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SEO_CONFIG.url },
        { "@type": "ListItem", position: 2, name: "About", item: `${SEO_CONFIG.url}/about` },
      ]
    }
  };
}

// ─── WebSite Schema ─────────────────────────────────────────
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SEO_CONFIG.url}/#website`,
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.url,
    description: SEO_CONFIG.description,
    inLanguage: "en-IN",
    publisher: {
      "@type": "Person",
      "@id": `${SEO_CONFIG.url}/#person`,
      name: "Suvojeet Sengupta"
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SEO_CONFIG.url}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

// ─── Music Schema ────────────────────────────────────────────
export function getMusicSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "@id": `${SEO_CONFIG.url}/#musicgroup`,
    name: "Suvojeet Sengupta",
    url: `${SEO_CONFIG.url}/music`,
    image: `${SEO_CONFIG.url}/suvojeet.jpg`,
    genre: ["Hindi Music", "Bengali Music", "Bollywood", "Soulful", "Patriotic"],
    foundingLocation: {
      "@type": "Place",
      name: "Asansol, West Bengal, India"
    },
    member: {
      "@type": "Person",
      "@id": `${SEO_CONFIG.url}/#person`,
      name: "Suvojeet Sengupta"
    },
    sameAs: [SEO_CONFIG.socials.youtube, SEO_CONFIG.socials.instagram, SEO_CONFIG.socials.facebook],
    description: "Suvojeet Sengupta performs soulful Hindi and Bengali covers in the tradition of Kishore Kumar, Lata Mangeshkar, and Arijit Singh."
  };
}

// ─── VideoObject Schema (per video) ─────────────────────────
export function getVideoObjectSchema(video: {
  title: string;
  description?: string;
  youtubeId: string;
  publishedAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description || `Soulful performance of "${video.title}" by Suvojeet Sengupta.`,
    thumbnailUrl: `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
    uploadDate: video.publishedAt,
    contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
    author: {
      "@type": "Person",
      "@id": `${SEO_CONFIG.url}/#person`,
      name: "Suvojeet Sengupta"
    },
    publisher: {
      "@type": "Person",
      name: "Suvojeet Sengupta",
      url: SEO_CONFIG.url
    }
  };
}

// ─── Project / SoftwareApplication Schema ───────────────────
export function getProjectSchema(
  projectName: string,
  description: string,
  projectUrl: string,
  extra: { githubUrl?: string; operatingSystem?: string; category?: string } = {}
) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${projectUrl}#app`,
    name: projectName,
    description,
    url: projectUrl,
    applicationCategory: extra.category || "MobileApplication",
    operatingSystem: extra.operatingSystem || "Android",
    author: {
      "@type": "Person",
      "@id": `${SEO_CONFIG.url}/#person`,
      name: "Suvojeet Sengupta",
      url: SEO_CONFIG.url
    },
    creator: {
      "@type": "Person",
      "@id": `${SEO_CONFIG.url}/#person`,
      name: "Suvojeet Sengupta"
    },
    ...(extra.githubUrl && { sameAs: extra.githubUrl }),
    inLanguage: "en",
    isAccessibleForFree: true,
  };
}

// ─── Article / BlogPosting Schema ───────────────────────────
export function getBlogPostSchema(post: {
  title: string;
  excerpt?: string | null;
  slug: string;
  publishedAt: string;
  updatedAt?: string | null;
  author: string;
  tags?: string[];
  category?: string;
  imageUrl?: string | null;
}) {
  const url = `${SEO_CONFIG.url}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt || post.title,
    url,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    inLanguage: "en-IN",
    author: {
      "@type": "Person",
      "@id": `${SEO_CONFIG.url}/#person`,
      name: post.author,
      url: SEO_CONFIG.url,
    },
    publisher: {
      "@type": "Person",
      "@id": `${SEO_CONFIG.url}/#person`,
      name: "Suvojeet Sengupta",
      url: SEO_CONFIG.url,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: post.imageUrl && post.imageUrl.startsWith('http')
      ? {
          "@type": "ImageObject",
          url: post.imageUrl,
          width: 1200,
          height: 630,
        }
      : {
          "@type": "ImageObject",
          url: getOgImageUrl(post.title),
          width: 1200,
          height: 630,
        },
    ...(post.tags?.length && { keywords: post.tags.join(', ') }),
    ...(post.category && { articleSection: post.category }),
    isPartOf: {
      "@type": "Blog",
      "@id": `${SEO_CONFIG.url}/blog#blog`,
      name: "Suvojeet Sengupta — Blog",
      url: `${SEO_CONFIG.url}/blog`,
    }
  };
}

// ─── FAQ Schema ──────────────────────────────────────────────
export function getFAQSchema(faqs: Array<{ question: string; answer: string }>) {
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
