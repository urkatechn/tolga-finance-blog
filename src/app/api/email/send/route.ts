import { NextRequest, NextResponse } from "next/server";
import { sendEmailToDefault } from "@/lib/email/service";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      subject, 
      recipientName, 
      content, 
      buttonText, 
      buttonUrl, 
      footerText, 
      brandName,
      to 
    } = body;

    // Validate required fields
    if (!subject || typeof subject !== "string") {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 });
    }

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // If 'to' is provided, validate it, otherwise use default
    let recipient = "ttanagardigil@urkatech.com";
    if (to) {
      if (typeof to !== "string" || !isValidEmail(to)) {
        return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
      }
      recipient = to;
    }

    // Send the email
    const result = await sendEmailToDefault({
      subject: subject.trim(),
      recipientName: recipientName?.trim(),
      content: content.trim(),
      buttonText: buttonText?.trim(),
      buttonUrl: buttonUrl?.trim(),
      footerText: footerText?.trim(),
      brandName: brandName?.trim(),
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      data: result.data
    });

  } catch (error: unknown) {
    console.error("API error:", error);
    const message = error instanceof Error ? error.message : "Failed to send email";
    return NextResponse.json({ 
      error: message,
      success: false 
    }, { status: 500 });
  }
}

// GET endpoint for testing
export async function GET() {
  try {
    // Send a test email
    const result = await sendEmailToDefault({
      subject: "Test Email from Email Template System",
      recipientName: "Tolga",
      content: "This is a test email sent from the new email template system. The system is working correctly!",
      buttonText: "Visit Blog",
      buttonUrl: "https://tolgatanagardigil.com",
      footerText: "This is an automated test email from the finance blog application."
    });

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      data: result.data
    });

  } catch (error: unknown) {
    console.error("Test email error:", error);
    const message = error instanceof Error ? error.message : "Failed to send test email";
    return NextResponse.json({ 
      error: message,
      success: false 
    }, { status: 500 });
  }
}