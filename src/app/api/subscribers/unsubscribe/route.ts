import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyUnsubscribeToken } from "@/lib/newsletter";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const email = url.searchParams.get("e") || "";
  const id = url.searchParams.get("id") || "";
  const token = url.searchParams.get("t") || "";

  if (!email || !id || !token) {
    return NextResponse.redirect(`${url.origin}/unsubscribe?status=invalid`);
  }

  try {
    if (!verifyUnsubscribeToken(email, id, token)) {
      return NextResponse.redirect(`${url.origin}/unsubscribe?status=invalid`);
    }

    const supabase = await createServiceClient();
    // Check current status to make operation idempotent
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id, is_subscribed")
      .eq("id", id)
      .eq("email", email)
      .maybeSingle();

    if (!existing) {
      return NextResponse.redirect(`${url.origin}/unsubscribe?status=invalid`);
    }

    if (!existing.is_subscribed) {
      // Already unsubscribed
      return NextResponse.redirect(`${url.origin}/unsubscribe?status=already`);
    }

    const { error } = await supabase
      .from("subscribers")
      .update({ is_subscribed: false, update_date_time: new Date().toISOString() })
      .eq("id", id)
      .eq("email", email);

    if (error) {
      return NextResponse.redirect(`${url.origin}/unsubscribe?status=error`);
    }

    return NextResponse.redirect(`${url.origin}/unsubscribe?status=success`);
  } catch {
    return NextResponse.redirect(`${url.origin}/unsubscribe?status=error`);
  }
}
