import { Metadata } from "next";
import { ServerHeader, ServerFooter } from "@/components/server-layout";
import { getServerSettings } from "@/lib/server-settings";
import { AboutMotion } from "@/components/pages/about-motion";

export const metadata: Metadata = {
  title: "About Me | Finance Blog",
  description: "Hi, I'm a finance enthusiast sharing my journey and insights to help others navigate their financial decisions.",
};

// Force dynamic rendering to avoid build-time Supabase issues
export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const settings = await getServerSettings();

  return (
    <div className="min-h-screen">
      <ServerHeader settings={settings} />
      <AboutMotion settings={settings} />
      <ServerFooter settings={settings} />
    </div>
  );
}
