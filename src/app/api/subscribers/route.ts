import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { buildUnsubscribeUrl } from "@/lib/newsletter";
import { subscriptionWelcomeEmailHtml, subscriptionWelcomeEmailText } from "@/lib/email/templates";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const supabase = await createServiceClient();
    const origin = req.nextUrl.origin;
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromAddress = process.env.NEWSLETTER_FROM || "info@notifications.tolgatanagardigil.com";

    // Try to find existing subscriber by email
    const { data: existing, error: findError } = await supabase
      .from("subscribers")
      .select("id, is_subscribed, subscription_date_time")
      .eq("email", email)
      .limit(1)
      .maybeSingle();

    if (findError) {
      return NextResponse.json({ error: findError.message }, { status: 500 });
    }

    const now = new Date().toISOString();

    if (existing) {
      if (existing.is_subscribed) {
        // Idempotent: already subscribed, do nothing
        return NextResponse.json({ success: true, status: "already_subscribed" });
      }
      // Update existing subscriber to subscribed
      const { error: updateError } = await supabase
        .from("subscribers")
        .update({
          is_subscribed: true,
          update_date_time: now,
          // If they never had a subscription_date_time, set it now
          subscription_date_time: existing.subscription_date_time ?? now,
        })
        .eq("id", existing.id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      // Send welcome email only if previously unsubscribed
      if (!existing.is_subscribed) {
        try {
          const unsubscribeUrl = buildUnsubscribeUrl(origin, email, existing.id.toString());
          const html = subscriptionWelcomeEmailHtml({ unsubscribeUrl });
          const text = subscriptionWelcomeEmailText({ unsubscribeUrl });
          await resend.emails.send({
            from: fromAddress,
            to: [email],
            subject: "Thanks for subscribing",
            html,
            text,
          });
        } catch {
          // Ignore email delivery failures to not block subscription
        }
      }

      return NextResponse.json({ success: true, status: "updated" });
    } else {
      // Insert new subscriber
      const { data: inserted, error: insertError } = await supabase
        .from("subscribers")
        .insert({
          email,
          is_subscribed: true,
          subscription_date_time: now,
          update_date_time: now,
        })
        .select("id")
        .single();

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
      // Send welcome email for new subscriber
      if (inserted?.id) {
        try {
          const unsubscribeUrl = buildUnsubscribeUrl(origin, email, inserted.id.toString());
          const html = subscriptionWelcomeEmailHtml({ unsubscribeUrl });
          const text = subscriptionWelcomeEmailText({ unsubscribeUrl });
          await resend.emails.send({
            from: fromAddress,
            to: [email],
            subject: "Thanks for subscribing",
            html,
            text,
          });
        } catch {
          // Ignore email delivery failures to not block subscription
        }
      }

      return NextResponse.json({ success: true, status: "created" });
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
