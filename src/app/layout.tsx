import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SupabaseProvider from "@/components/supabase-provider";
import { Toaster } from "@/components/ui/sonner";
import { SettingsProvider } from "@/contexts/settings-context";
import { LanguageProvider } from "@/contexts/language-context";
import { getServerSettings } from "@/lib/server-settings";
import { DynamicFavicon } from "@/components/dynamic-favicon";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings();

  return {
    title: {
      default: settings.site_brand_name,
      template: `%s | ${settings.site_brand_name}`,
    },
    description: settings.site_description,
    keywords: settings.site_keywords,
    authors: [{ name: settings.meta_author }],
    creator: settings.meta_creator,
    openGraph: {
      type: settings.meta_og_type as "website",
      locale: settings.meta_og_locale,
      url: settings.site_url,
      title: settings.site_brand_name,
      description: settings.site_description,
      siteName: settings.site_brand_name,
    },
    twitter: {
      card: settings.meta_twitter_card as "summary_large_image",
      title: settings.site_brand_name,
      description: settings.site_description,
      creator: settings.meta_twitter_creator,
    },
    icons: {
      icon: settings.site_favicon_url || "/favicon.ico",
    },
    manifest: "/manifest.json",
    themeColor: "#2563eb",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: settings.site_brand_name,
    },
  };
}

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
            <SettingsProvider>
              <LanguageProvider>
                <DynamicFavicon />
                {children}
                <Toaster />
              </LanguageProvider>
            </SettingsProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
