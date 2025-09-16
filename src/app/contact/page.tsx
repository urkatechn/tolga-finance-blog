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
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ContactForm from "@/components/contact/contact-form";
import Link from "next/link";
import { LINKEDIN_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact Me | Finance Blog",
  description: "Get in touch! Whether you have questions, feedback, or just want to chat about money and investing.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="block text-gray-900 dark:text-white mb-2">
                Let&apos;s Chat About
              </span>
              <span className="block text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] [background-clip:text]">
                Money & Life
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Got questions? Want to share your financial wins or disasters? 
              Or maybe you just want to tell me I&apos;m completely wrong about something? I&apos;d love to hear from you.
            </p>
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
                  <CardTitle className="text-xl">LinkedIn</CardTitle>
                  <CardDescription className="text-base">
                    Connect with me professionally or send a quick message about finance topics.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" asChild className="w-full">
                    <Link href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="mr-2 h-4 w-4" />
                      Connect
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
                  <CardTitle className="text-xl">Response Time</CardTitle>
                  <CardDescription className="text-base">
                    I usually respond within 24-48 hours. Sometimes faster if I&apos;m procrastinating on other work.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    24-48h
                  </div>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Send Me a Message</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Use this form if you prefer. I read every message, even if it&apos;s just to tell me my investment advice is terrible.
              </p>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Common Questions</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Before you reach out, here are some things people often ask about.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <CardTitle className="text-xl">Can you give me personal financial advice?</CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    I&apos;m not a licensed financial advisor, so I can&apos;t give personalized advice. 
                    But I&apos;m happy to share general thoughts and point you toward good resources!
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <Coffee className="h-6 w-6 text-brown-600" />
                    <CardTitle className="text-xl">Want to collaborate or guest post?</CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    I&apos;m always open to interesting collaborations! Send me your ideas and 
                    let&apos;s see if we can create something valuable together.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <CardTitle className="text-xl">How do you handle my information?</CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    I respect your privacy. I won&apos;t share your email or information with anyone, 
                    and I definitely won&apos;t spam you with sales pitches.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    <CardTitle className="text-xl">Can I suggest article topics?</CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    Absolutely! I&apos;m always looking for new topics to explore. 
                    If there&apos;s something you&apos;re curious about, let me know.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
