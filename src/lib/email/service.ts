import { Resend } from "resend";
import { genericEmailHtml, genericEmailText, EmailTemplateData } from "./templates";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  recipientName?: string;
  content: string;
  buttonText?: string;
  buttonUrl?: string;
  footerText?: string;
  brandName?: string;
  fromAddress?: string;
}

export async function sendGenericEmail(options: SendEmailOptions) {
  const {
    to,
    subject,
    recipientName,
    content,
    buttonText,
    buttonUrl,
    footerText,
    brandName,
    fromAddress = process.env.NEWSLETTER_FROM || "info@notifications.tolgatanagardigil.com"
  } = options;

  // Prepare template data
  const templateData: EmailTemplateData = {
    subject,
    recipientName,
    content,
    buttonText,
    buttonUrl,
    footerText,
    brandName
  };

  // Generate HTML and text versions
  const html = genericEmailHtml(templateData);
  const text = genericEmailText(templateData);

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    });

    if (error) {
      console.error("Email sending error:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}

// Convenience function for sending to the default email (ttanagardigil@urkatech.com)
export async function sendEmailToDefault(options: Omit<SendEmailOptions, 'to'>) {
  return sendGenericEmail({
    ...options,
    to: "ttanagardigil@urkatech.com"
  });
}