import { Metadata } from "next";
import { ServerHeader, ServerFooter } from "@/components/server-layout";
import { getServerSettings } from "@/lib/server-settings";
import { ContactMotion } from "@/components/pages/contact-motion";

export const metadata: Metadata = {
  title: "Contact Me | Finance Blog",
  description: "Get in touch! Whether you have questions, feedback, or just want to chat about money and investing.",
};

export default async function ContactPage() {
  const settings = await getServerSettings();
  return (
    <div className="min-h-screen">
      <ServerHeader settings={settings} />
      <ContactMotion settings={settings} />
      <ServerFooter settings={settings} />
    </div>
  );
}
