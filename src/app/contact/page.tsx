import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  MessageCircle, 
  Clock,
  Coffee,
  Linkedin
} from "lucide-react";
import { ServerHeader, ServerFooter } from "@/components/server-layout";
import { getServerSettings } from "@/lib/server-settings";
import ContactForm from "@/components/contact/contact-form";
import Link from "next/link";
import { LINKEDIN_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact Me | Finance Blog",
  description: "Get in touch! Whether you have questions, feedback, or just want to chat about money and investing.",
};

export default async function ContactPage() {
  const settings = await getServerSettings();
  return (
    <div className="min-h-screen">
      <ServerHeader settings={settings} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="block text-gray-900 dark:text-white mb-2">{settings.contact_hero_line1}</span>
              <span className="block text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] [background-clip:text]">{settings.contact_hero_title}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">{settings.contact_hero_subtitle}</p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              
              {/* LinkedIn */}
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-4">
                    <Linkedin className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">{settings.contact_linkedin_card_title}</CardTitle>
                  <CardDescription className="text-base">{settings.contact_linkedin_card_description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" asChild className="w-full justify-center">
                    <Link href={settings.social_linkedin || LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                      {settings.contact_linkedin_button_text}
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-4">
                    <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl">{settings.contact_response_title}</CardTitle>
                  <CardDescription className="text-base">{settings.contact_response_description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{settings.contact_response_time}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{settings.contact_form_title}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{settings.contact_form_description}</p>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {settings.contact_faq_enabled && Array.isArray((settings as any).contact_faq_items) && (settings as any).contact_faq_items.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{settings.contact_faq_title}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">{settings.contact_faq_subtitle}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {((settings as any).contact_faq_items as Array<{ question: string; answer: string }>).map((item, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex items-center space-x-3 mb-3">
                        <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        <CardTitle className="text-xl">{item.question}</CardTitle>
                      </div>
                      <CardDescription className="text-base leading-relaxed">{item.answer}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <ServerFooter settings={settings} />
    </div>
  );
}
