import { Inter } from "next/font/google";
// @ts-ignore
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { ThemeProvider } from "@/components/common/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Suvojeet Sengupta | Singer & Creative Developer",
  description: "Official portfolio of Suvojeet Sengupta. A soulful singer in Hindi and Bengali, inspired by Kishore Kumar and Arijit Singh. Also a high-performance Android Developer.",
  keywords: ["Suvojeet Sengupta", "Singer", "Bengali Singer", "Hindi Singer", "Android Developer", "SuvMusic", "NoteNext", "Asansol Singer"],
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
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
