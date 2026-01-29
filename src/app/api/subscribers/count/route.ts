import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createServiceClient();

    const { count, error } = await supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .eq("is_subscribed", true);

    if (error) {
      console.error("Error fetching subscriber count:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Add a small random offset if count is very low to make it look "busier" if desired,
    // but the request asks for "actual" count. 
    // We can also just return the real count.
    
    return NextResponse.json({ count: count || 0 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unexpected error staff";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
