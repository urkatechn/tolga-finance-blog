import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

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

      return NextResponse.json({ success: true, status: "updated" });
    } else {
      // Insert new subscriber
      const { error: insertError } = await supabase
        .from("subscribers")
        .insert({
          email,
          is_subscribed: true,
          subscription_date_time: now,
          update_date_time: now,
        });

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, status: "created" });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}
