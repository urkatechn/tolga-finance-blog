import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { sendNewPostNotifications } from "@/lib/notifications/post-notifications";

/**
 * POST /api/notifications/posts
 * Manually trigger email notifications for a published post
 */
export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated (admin only)
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await req.json();
    
    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    // Always use the production domain for email links
    const origin = 'https://tolgatanagardigil.com';

    // Fetch the post with related data
    const { data: post, error } = await supabase
      .from("posts")
      .select(`
        id,
        title,
        slug,
        excerpt,
        status,
        email_notification_sent,
        email_notification_sent_at,
        author:authors(id, name),
        category:categories(id, name)
      `)
      .eq("id", postId)
      .single();

    if (error) {
      console.error("Error fetching post:", error);
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
    }

    // Check if post is published
    if (post.status !== "published") {
      return NextResponse.json({ 
        error: "Only published posts can have notifications sent" 
      }, { status: 400 });
    }

    // Send notifications
    const result = await sendNewPostNotifications(
      {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        author: post.author,
        category: post.category
      },
      origin
    );

    return NextResponse.json({
      success: true,
      message: "Notifications sent successfully",
      result
    });

  } catch (error: unknown) {
    console.error("Error sending post notifications:", error);
    const message = error instanceof Error ? error.message : "Failed to send notifications";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/notifications/posts?postId=<id>
 * Get notification status/statistics for a post
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Get post details
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id, title, status, published_at, email_notification_sent, email_notification_sent_at")
      .eq("id", postId)
      .single();

    if (postError) {
      if (postError.code === "PGRST116") {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
    }

    // Get subscriber count
    const { count: subscriberCount, error: subError } = await supabase
      .from("subscribers")
      .select("id", { count: "exact" })
      .eq("is_subscribed", true);

    if (subError) {
      console.error("Error fetching subscriber count:", subError);
    }

    // Check if notifications are enabled
    const { data: settings } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "enable_email_notifications")
      .single();

    const notificationsEnabled = settings?.value === "false" ? false : true;

    return NextResponse.json({
      post: {
        id: post.id,
        title: post.title,
        status: post.status,
        published_at: post.published_at,
        email_notification_sent: post.email_notification_sent,
        email_notification_sent_at: post.email_notification_sent_at
      },
      stats: {
        totalSubscribers: subscriberCount || 0,
        notificationsEnabled,
        canSendNotification: post.status === "published",
        hasNotificationBeenSent: post.email_notification_sent
      }
    });

  } catch (error: unknown) {
    console.error("Error fetching notification stats:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}