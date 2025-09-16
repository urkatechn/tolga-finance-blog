import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyUnsubscribeToken } from "@/lib/newsletter";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const email = url.searchParams.get("e") || "";
  const id = url.searchParams.get("id") || "";
  const token = url.searchParams.get("t") || "";

  const invalidHtml = (msg: string) =>
    new Response(
      `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"/><title>Unsubscribe</title></head><body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;background:#f8fafc;margin:0;padding:40px;">` +
        `<div style="max-width:680px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:28px;">` +
        `<h1 style="margin:0 0 12px 0;font-size:22px;color:#0f172a;">Unsubscribe</h1>` +
        `<p style="margin:0;color:#334155;">${msg}</p>` +
        `</div></body></html>`,
      { status: 400, headers: { "content-type": "text/html; charset=utf-8" } }
    );

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
