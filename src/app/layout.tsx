import { Fraunces, JetBrains_Mono } from "next/font/google";
// @ts-ignore
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import Providers from "@/components/common/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEO_CONFIG, getEnhancedPersonSchema, getWebSiteSchema } from "@/lib/seo";
import { Metadata } from "next";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "600", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.url),
  applicationName: SEO_CONFIG.siteName,
  title: {
    default: SEO_CONFIG.title,
    template: `%s | ${SEO_CONFIG.siteName}`,
  },
  description: SEO_CONFIG.description,
  keywords: SEO_CONFIG.keywords,
  authors: [{ name: "Suvojeet Sengupta", url: SEO_CONFIG.url }],
  creator: "Suvojeet Sengupta",
  publisher: "Suvojeet Sengupta",
  category: "portfolio",
  openGraph: {
    type: "website",
    locale: SEO_CONFIG.locale,
    url: SEO_CONFIG.url,
    title: SEO_CONFIG.title,
    description: SEO_CONFIG.description,
    siteName: SEO_CONFIG.siteName,
    images: [
      {
        url: "/suvojeet.jpg",
        width: 1200,
        height: 630,
        alt: "Suvojeet Sengupta — Vibe Architect & Soulful Singer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_CONFIG.title,
    description: SEO_CONFIG.description,
    images: ["/suvojeet.jpg"],
    creator: SEO_CONFIG.twitterHandle,
    site: SEO_CONFIG.twitterSite,
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SEO_CONFIG.url,
    types: {
      "application/rss+xml": `${SEO_CONFIG.url}/rss.xml`,
    },
  },
  verification: {
    // Add your Google Search Console verification code here when you get it:
    // google: "YOUR_GOOGLE_VERIFICATION_CODE",
    // bing: "YOUR_BING_VERIFICATION_CODE",
  },
  other: {
    "theme-color": "#ea580c",
    "color-scheme": "light dark",
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const personSchema = getEnhancedPersonSchema();
  const websiteSchema = getWebSiteSchema();

  const navSchema = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: ['Home', 'About', 'Music', 'Blog', 'Contact'],
    url: [
      `${SEO_CONFIG.url}/`,
      `${SEO_CONFIG.url}/about`,
      `${SEO_CONFIG.url}/music`,
      `${SEO_CONFIG.url}/blog`,
      `${SEO_CONFIG.url}/contact`
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="alternate" type="application/rss+xml" title={`${SEO_CONFIG.siteName} Blog`} href={`${SEO_CONFIG.url}/rss.xml`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(navSchema) }}
        />
      </head>
      <body className={`${fraunces.variable} ${jetbrainsMono.variable} antialiased selection:bg-brand-orange selection:text-white`}>
        <Providers>
          <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
            <Navbar />
            <ClientLayout>
              <main className="min-h-screen">
                {children}
              </main>
            </ClientLayout>
            <Footer />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
