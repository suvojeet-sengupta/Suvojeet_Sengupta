import { Geist, Geist_Mono, Poppins, Montserrat, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "Suvojeet Sengupta | The Vibe Architect",
  description: "Product-First Software Engineer, System Architect, and Singer based in India. Specializing in mobile development with Android/Flutter and AI-augmented workflows.",
  keywords: ["Suvojeet Sengupta", "Android Developer", "Flutter Developer", "Vibe Coder", "Singer", "System Architect", "Mobile Development", "Kotlin", "Dart"],
  authors: [{ name: "Suvojeet Sengupta" }],
  creator: "Suvojeet Sengupta",
  openGraph: {
    title: "Suvojeet Sengupta | The Vibe Architect",
    description: "Singer • Android Vibe Coder • System Architect",
    url: "https://suvojeetsengupta.in",
    siteName: "Suvojeet Sengupta",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Suvojeet Sengupta | The Vibe Architect",
    description: "Singer • Android Vibe Coder • System Architect",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${poppins.variable} ${montserrat.variable} antialiased`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
