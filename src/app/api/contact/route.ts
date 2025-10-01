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
    const submittedAt = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
      timeZoneName: "short",
    }).format(new Date());

    const emailContent = [
      "You just received a new contact request from the Tolga Tangardigil website.",
      "",
      "Summary",
      `- From: ${fullName}`,
      `- Email: ${email.trim()}`,
      `- Subject: ${subject.trim()}`,
      `- Submitted: ${submittedAt}`,
      "",
      "Message",
      message.trim(),
    ].join("\n");

    // Send email using the existing email service
    await sendEmailToDefault({
      subject: `New Website Contact: ${subject.trim()}`,
      content: emailContent,
      footerText: `Reply directly to this email to reach ${fullName} at ${email.trim()}.`
        + " If you prefer, you can copy their address into a new message.",
      brandName: "Tolga Tangardigil",
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
