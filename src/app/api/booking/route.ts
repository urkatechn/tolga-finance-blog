import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, date, service, message } = body;

        if (!name || !email || !date || !service) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabase = await createServiceClient();
        const resend = new Resend(process.env.RESEND_API_KEY);
        const adminEmail = "info@tolgatanagardigil.com";

        // 1. Send Email Notification to Admin
        const { error: emailError } = await resend.emails.send({
            from: "info@notifications.tolgatanagardigil.com",
            to: [adminEmail],
            subject: `New Meeting Request: ${name}`,
            html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #0f172a;">New Strategic Advisory Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Preferred Date:</strong> ${date}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f8fafc; padding: 15px; border-radius: 5px;">${message || "No message provided."}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">This request was generated from the services page.</p>
        </div>
      `,
        });

        if (emailError) {
            console.error("Resend error:", emailError);
        }

        // 2. Insert into Notifications Table for UI Realtime
        const { error: dbError } = await supabase.from("notifications").insert([
            {
                type: "meeting_request",
                title: `Meeting Request: ${name}`,
                message: `${name} (${email}) requested a consultation for ${service} on ${date}.`,
                data: { name, email, date, service, message },
            },
        ]);

        if (dbError) {
            console.error("Supabase Error:", dbError);
            return NextResponse.json({ error: "Failed to log notification" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Booking API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
