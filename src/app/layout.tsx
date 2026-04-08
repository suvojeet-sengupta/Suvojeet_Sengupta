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
  title: "Suvojeet Sengupta | Creative Developer & Music Artist",
  description: "Portfolio of Suvojeet Sengupta, featuring SuvMusic, NoteNext, and professional music artistry.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased selection:bg-brand-orange selection:text-white`}>
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
