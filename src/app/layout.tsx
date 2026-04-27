import { Inter } from "next/font/google";
// @ts-ignore
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import Providers from "@/components/common/Providers";
import { SEO_CONFIG } from "@/lib/seo";
import { Metadata } from "next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.url),
  title: {
    default: SEO_CONFIG.title,
    template: `%s | ${SEO_CONFIG.siteName}`,
  },
  description: SEO_CONFIG.description,
  keywords: SEO_CONFIG.keywords,
  authors: [{ name: "Suvojeet Sengupta", url: SEO_CONFIG.url }],
  creator: "Suvojeet Sengupta",
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
        alt: "Suvojeet Sengupta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_CONFIG.title,
    description: SEO_CONFIG.description,
    images: ["/suvojeet.jpg"],
    creator: SEO_CONFIG.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Suvojeet Sengupta',
    url: 'https://suvojeetsengupta.in',
    jobTitle: ['Android Developer', 'Singer'],
    sameAs: [
      'https://github.com/suvojeet-sengupta',
      'https://linkedin.com/in/suvojeet-sengupta',
      'https://instagram.com/suvojeet_sengupta',
      'https://youtube.com/@suvojeetsengupta'
    ],
    description: 'Suvojeet Sengupta is a professional Android Developer and a soulful Singer based in India.'
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/suvojeet.jpg" as="image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} antialiased selection:bg-brand-orange selection:text-white`}>
        <Providers>
          <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
            <ClientLayout>{children}</ClientLayout>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
