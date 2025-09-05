import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SupabaseProvider from "@/components/supabase-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Finance Blog",
    template: "%s | Finance Blog",
  },
  description: "A modern finance blog with expert insights and analysis",
  keywords: ["finance", "investing", "money", "retirement", "blog"],
  authors: [{ name: "Finance Blog Team" }],
  creator: "Finance Blog Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://finance-blog.example.com",
    title: "Finance Blog",
    description: "A modern finance blog with expert insights and analysis",
    siteName: "Finance Blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finance Blog",
    description: "A modern finance blog with expert insights and analysis",
    creator: "@financeblog",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SupabaseProvider>
            {children}
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
