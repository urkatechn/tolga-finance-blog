import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/posts/[postId]/reset-notification
 * Reset email notification status for a post (allows resending notifications)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    // Check if user is authenticated (admin only)
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId: id } = await params;
    const supabase = await createClient();

    // Check if post exists
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id, title, status")
      .eq("id", id)
      .single();

    if (postError) {
      if (postError.code === "PGRST116") {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
    }

    // Reset email notification status
    const { error: updateError } = await supabase
      .from("posts")
      .update({
        email_notification_sent: false,
        email_notification_sent_at: null
      })
      .eq("id", id);

    if (updateError) {
      console.error("Error resetting notification status:", updateError);
      return NextResponse.json({ error: "Failed to reset notification status" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Email notification status reset for "${post.title}". You can now send notifications manually.`,
      post: {
        id: post.id,
        title: post.title,
        status: post.status,
        email_notification_sent: false,
        email_notification_sent_at: null
      }
    });

  } catch (error: unknown) {
    console.error("Error resetting notification status:", error);
    const message = error instanceof Error ? error.message : "Failed to reset notification status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}