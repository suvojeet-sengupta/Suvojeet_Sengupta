// =====================================================
// seo.ts — Maximum Google visibility
// =====================================================

export function getOgImageUrl(text: string): string {
  const base = (process.env.NEXT_PUBLIC_OG_IMAGE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.suvojeetsengupta.in').replace(/\/+$/, '');
  return `${base}/api/public/og?${new URLSearchParams({ text })}`;
}

export const SEO_CONFIG = {
  title: "Suvojeet Sengupta — Software Developer & Vocalist",
  description: "Suvojeet Sengupta is a software developer and Hindi & Bengali vocalist from Dhanbad, India. He builds Android apps and backend services, including SuvMusic and NoteNext, and records and performs music.",
  siteName: "Suvojeet Sengupta",
  url: "https://suvojeetsengupta.in",
  twitterHandle: "@suvojeet_s",
  twitterSite: "@suvojeet_s",
  locale: "en_IN",
  keywords: [
    "Suvojeet Sengupta",
    "software developer",
    "backend developer",
    "Android developer",
    "NestJS developer",
    "Kotlin developer",
    "Hindi singer",
    "Bengali singer",
    "vocalist",
    "Suvojeet Sengupta singer",
    "Suvojeet Sengupta developer",
    "developer Dhanbad",
    "SuvMusic app",
    "NoteNext app",
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
    alternateName: ["Suvojeet", "Suvojeet Sengupta Singer"],
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
    jobTitle: "Software Developer & Vocalist",
    hasOccupation: [
      {
        "@type": "Occupation",
        name: "Software Developer",
        description: "Builds Android apps in Kotlin and Jetpack Compose and backend services with Node.js and NestJS.",
        occupationLocation: { "@type": "Country", name: "India" }
      },
      {
        "@type": "Occupation",
        name: "Vocalist",
        description: "Sings Hindi and Bengali songs, records covers and performs live.",
        occupationLocation: { "@type": "Country", name: "India" }
      }
    ],
    worksFor: {
      "@type": "Organization",
      name: "gOGig",
      url: "https://gogig.tech"
    },
    description: SEO_CONFIG.description,
    knowsAbout: [
      "Backend development",
      "Node.js",
      "NestJS",
      "REST API design",
      "Android development",
      "Kotlin",
      "Jetpack Compose",
      "Next.js",
      "Cloudflare",
      "AI-assisted software development",
      "Hindi and Bengali vocals",
      "Live music performance"
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
    description: "About Suvojeet Sengupta, a software developer and Hindi & Bengali vocalist from Dhanbad, India.",
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
