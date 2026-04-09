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
