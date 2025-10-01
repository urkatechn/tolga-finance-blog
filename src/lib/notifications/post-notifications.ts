import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/server";
import { buildUnsubscribeUrl } from "@/lib/newsletter";
import { newPostNotificationEmailHtml, newPostNotificationEmailText, NewPostNotificationData } from "@/lib/email/templates";

export interface PostData {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  author?: {
    name: string;
  };
  category?: {
    name: string;
  };
}

export interface NotificationResult {
  success: boolean;
  totalSubscribers: number;
  emailsSent: number;
  failures: Array<{ email: string; error: string }>;
  postUpdated?: boolean;
}

/**
 * Sends new post notifications to all active subscribers
 */
export async function sendNewPostNotifications(
  postData: PostData,
  origin?: string
): Promise<NotificationResult> {
  const result: NotificationResult = {
    success: false,
    totalSubscribers: 0,
    emailsSent: 0,
    failures: []
  };

  try {
    const supabase = await createServiceClient();
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromAddress = process.env.NEWSLETTER_FROM || "info@notifications.tolgatanagardigil.com";

    // Check if notifications are enabled
    const { data: settings } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "enable_email_notifications")
      .single();

    // If setting doesn't exist, default to enabled (true)
    const notificationsEnabled = settings?.value === "false" ? false : true;
    
    if (!notificationsEnabled) {
      console.log("Email notifications are disabled");
      return {
        success: true,
        totalSubscribers: 0,
        emailsSent: 0,
        failures: []
      };
    }

    // Fetch all active subscribers
    const { data: subscribers, error } = await supabase
      .from("subscribers")
      .select("id, email")
      .eq("is_subscribed", true);

    if (error) {
      throw new Error(`Failed to fetch subscribers: ${error.message}`);
    }

    if (!subscribers || subscribers.length === 0) {
      return {
        success: true,
        totalSubscribers: 0,
        emailsSent: 0,
        failures: []
      };
    }

    result.totalSubscribers = subscribers.length;
    
    // Always use the production domain for email links
    const baseUrl = 'https://tolgatanagardigil.com';
    const postUrl = `${baseUrl}/blog/${postData.slug}`;
    
    // Send emails in batches to avoid overwhelming the email service
    const batchSize = 100; // Resend allows up to 100 recipients per API call
    const batches = [];
    
    for (let i = 0; i < subscribers.length; i += batchSize) {
      batches.push(subscribers.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      try {
        // Send to multiple recipients in a single API call
        const recipients = batch.map((sub: { id: number; email: string }) => sub.email);
        
        // For the batch email, we'll use a generic unsubscribe URL since we can't personalize per recipient
        // We'll create individual emails instead to properly handle unsubscribe URLs
        const emailPromises = batch.map(async (subscriber: { id: number; email: string }) => {
          try {
            const unsubscribeUrl = buildUnsubscribeUrl(baseUrl, subscriber.email, subscriber.id.toString());
            
            const templateData: NewPostNotificationData = {
              postTitle: postData.title,
              postExcerpt: postData.excerpt,
              postUrl,
              authorName: postData.author?.name,
              categoryName: postData.category?.name,
              unsubscribeUrl
            };

            const html = newPostNotificationEmailHtml(templateData);
            const text = newPostNotificationEmailText(templateData);

            await resend.emails.send({
              from: fromAddress,
              to: [subscriber.email],
              subject: `New post: ${postData.title}`,
              html,
              text,
            });

            result.emailsSent++;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            result.failures.push({
              email: subscriber.email,
              error: errorMessage
            });
            console.error(`Failed to send email to ${subscriber.email}:`, errorMessage);
          }
        });

        // Wait for all emails in this batch to complete
        await Promise.allSettled(emailPromises);
        
        // Add a small delay between batches to be respectful to the email service
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (batchError) {
        console.error("Batch processing error:", batchError);
        // Add all subscribers in failed batch to failures
        batch.forEach((subscriber: { id: number; email: string }) => {
          result.failures.push({
            email: subscriber.email,
            error: batchError instanceof Error ? batchError.message : "Batch processing failed"
          });
        });
      }
    }

    result.success = result.failures.length < result.totalSubscribers;
    
    // Update post to mark notification as sent
    if (result.success && result.emailsSent > 0) {
      try {
        const { error: updateError } = await supabase
          .from('posts')
          .update({
            email_notification_sent: true,
            email_notification_sent_at: new Date().toISOString()
          })
          .eq('id', postData.id);
        
        if (updateError) {
          console.error('Failed to update post notification status:', updateError);
        } else {
          result.postUpdated = true;
        }
      } catch (updateErr) {
        console.error('Error updating post notification status:', updateErr);
      }
    }
    
    console.log(`Post notification sent: ${result.emailsSent}/${result.totalSubscribers} emails sent successfully`);
    
    return result;
  } catch (error) {
    console.error("Error sending post notifications:", error);
    throw error;
  }
}

/**
 * Helper function to check if a post should trigger notifications
 */
export function shouldSendNotification(
  currentStatus: string, 
  newStatus: string, 
  isNewPost = false, 
  emailAlreadySent = false
): boolean {
  // Send notification ONLY when:
  // 1. New post is created and immediately published AND email hasn't been sent
  // 2. Existing draft/archived post is published for the first time AND email hasn't been sent
  if (newStatus === "published" && (isNewPost || currentStatus !== "published") && !emailAlreadySent) {
    return true;
  }
  
  return false;
}

