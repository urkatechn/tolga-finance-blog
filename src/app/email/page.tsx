import { Metadata } from "next";
import { ServerHeader, ServerFooter } from "@/components/server-layout";
import { getServerSettings } from "@/lib/server-settings";
import EmailTemplateForm from "@/components/email/email-template-form";

export const metadata: Metadata = {
  title: "Send Email | Finance Blog",
  description: "Send emails using the template system",
};

export default async function EmailPage() {
  const settings = await getServerSettings();
  return (
    <div className="min-h-screen">
      <ServerHeader settings={settings} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Email Template System</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Create and send professional emails using our template system. 
              All emails will be sent to <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">info@tolgatanagardigil.com</code>.
            </p>
          </div>

          <EmailTemplateForm />

          {/* Usage Examples */}
          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Usage Examples</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Simple Notification:</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Subject: &quot;New Blog Post Published&quot; • Content: &quot;Check out our latest article on market analysis.&quot;
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">With Action Button:</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Subject: &quot;Weekly Newsletter&quot; • Content: &quot;Market updates...&quot; • Button: &quot;Read Full Newsletter&quot;
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Personal Message:</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Recipient Name: &quot;Tolga&quot; • Subject: &quot;Monthly Review&quot; • Content: &quot;Here&#39;s your monthly performance summary...&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ServerFooter settings={settings} />
    </div>
  );
}
