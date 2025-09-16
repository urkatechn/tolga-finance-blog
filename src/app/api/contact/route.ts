import { NextRequest, NextResponse } from "next/server";
import { sendEmailToDefault } from "@/lib/email/service";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, subject, message } = body;

    // Validate required fields
    if (!firstName || typeof firstName !== "string") {
      return NextResponse.json({ error: "First name is required" }, { status: 400 });
    }

    if (!lastName || typeof lastName !== "string") {
      return NextResponse.json({ error: "Last name is required" }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    if (!subject || typeof subject !== "string") {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 });
    }

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Prepare email content
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const emailContent = `You have received a new contact form submission from the Finance Blog.

Contact Details:
- Name: ${fullName}
- Email: ${email.trim()}
- Subject: ${subject.trim()}

Message:
${message.trim()}

---
This message was sent through the contact form on the Finance Blog website.`;

    // Send email using the existing email service
    await sendEmailToDefault({
      subject: `Contact Form: ${subject.trim()}`,
      content: emailContent,
      footerText: `Reply directly to this email to respond to ${fullName} at ${email.trim()}`
    });

    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully"
    });

  } catch (error: unknown) {
    console.error("Contact form submission error:", error);
    const message = error instanceof Error ? error.message : "Failed to submit contact form";
    return NextResponse.json({ 
      error: message,
      success: false 
    }, { status: 500 });
  }
}