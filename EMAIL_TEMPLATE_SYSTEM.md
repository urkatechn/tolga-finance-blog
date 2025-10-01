# Email Template System

A comprehensive email template system built on top of Resend for the Finance Blog application. This system provides a reusable way to send professional emails with consistent branding.

## Features

- ✅ Professional HTML and text email templates
- ✅ Consistent branding (Tolga Tangardigil)
- ✅ Optional personalization with recipient names
- ✅ Optional call-to-action buttons
- ✅ Optional footer text
- ✅ Simple UI for email creation
- ✅ React hooks for programmatic usage
- ✅ TypeScript support
- ✅ Built on existing Resend integration

## Usage

### 1. Using the Email Form UI

Navigate to `/email` in your application to access the email creation form:

```
http://localhost:3000/email
```

The form includes:
- **Subject** (required): Email subject line
- **Recipient Name** (optional): For personalization ("Hi [Name]," greeting)
- **Content** (required): Main email body content
- **Button Text & URL** (optional): Call-to-action button
- **Footer Text** (optional): Additional footer information
- **Brand Name** (optional): Defaults to "Tolga Tangardigil"

### 2. Using the React Hook

For programmatic email sending from components:

```typescript
import { useEmailToDefault } from '@/hooks/use-email';

function MyComponent() {
  const { sendEmail, isLoading, error, success } = useEmailToDefault();

  const handleSendEmail = async () => {
    await sendEmail({
      subject: "New Blog Post Published",
      recipientName: "Tolga",
      content: "Check out our latest article on market volatility analysis.",
      buttonText: "Read Article",
      buttonUrl: "https://tolgatanagardigil.com/blog/market-volatility",
      footerText: "You received this because you subscribed to our blog updates."
    });
  };

  return (
    <button onClick={handleSendEmail} disabled={isLoading}>
      {isLoading ? 'Sending...' : 'Send Email'}
    </button>
  );
}
```

### 3. Direct API Usage

Send emails directly via API endpoint:

```javascript
// POST /api/email/send
const response = await fetch('/api/email/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subject: "Weekly Newsletter",
    recipientName: "Tolga",
    content: "Here are this week's market updates...",
    buttonText: "View Full Newsletter",
    buttonUrl: "https://example.com/newsletter",
    footerText: "Unsubscribe anytime by clicking here."
  })
});
```

### 4. Using the Email Service Directly

For server-side usage:

```typescript
import { sendEmailToDefault } from '@/lib/email/service';

// In an API route or server action
const result = await sendEmailToDefault({
  subject: "Monthly Report Ready",
  content: "Your monthly performance report is now available.",
  buttonText: "Download Report",
  buttonUrl: "https://app.example.com/reports"
});
```

## Email Template Structure

The system generates both HTML and plain text versions of emails with the following structure:

### HTML Template Features:
- Professional header with brand name
- Responsive design
- Consistent color scheme
- Optional greeting with recipient name
- Main content with preserved line breaks
- Optional styled call-to-action button
- Optional footer section

### Plain Text Template:
- Clean, readable format
- All information preserved
- Links included for buttons
- Proper spacing and formatting

## Configuration

### Environment Variables

Make sure these environment variables are set:

```env
RESEND_API_KEY=your_resend_api_key
NEWSLETTER_FROM=info@notifications.tolgatanagardigil.com
```

### Default Recipient

All emails are currently sent to: `info@tolgatanagardigil.com`

This can be customized by modifying the `sendEmailToDefault` function or using `sendGenericEmail` directly with a different recipient.

## File Structure

```
src/
├── lib/email/
│   ├── templates.ts          # Email template functions
│   └── service.ts           # Email sending service
├── components/email/
│   └── email-template-form.tsx  # UI form component
├── hooks/
│   └── use-email.ts         # React hooks for email sending
├── app/
│   ├── email/
│   │   └── page.tsx         # Email creation page
│   └── api/email/send/
│       └── route.ts         # API endpoint
└── EMAIL_TEMPLATE_SYSTEM.md # This documentation
```

## Example Email Output

When you send an email with:
- Subject: "Welcome to our newsletter"
- Recipient Name: "John"
- Content: "Thank you for subscribing to our finance blog."
- Button: "Visit Blog" → "https://tolgatanagardigil.com"

The recipient receives a professional email with:
- Header: "Tolga Tangardigil"
- Title: "Welcome to our newsletter"
- Greeting: "Hi John,"
- Content: The provided message
- Blue button linking to the blog
- Clean, professional styling

## Testing

### Quick Test

Visit `/api/email/send` in your browser (GET request) to send a test email, or use the form at `/email`.

### Custom Test

Use the email form or API to send custom test emails and verify formatting, content, and delivery.

## Integration Examples

### Blog Post Notifications

```typescript
// When a new blog post is published
await sendEmailToDefault({
  subject: "New Post: Understanding Market Volatility",
  content: "I've just published a new article about market volatility and investment strategies.",
  buttonText: "Read the Article",
  buttonUrl: `https://tolgatanagardigil.com/blog/${postSlug}`,
  footerText: "Thanks for following the blog!"
});
```

### Contact Form Responses

```typescript
// When someone submits a contact form
await sendEmailToDefault({
  subject: "New Contact Form Submission",
  content: `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`,
  footerText: "This is an automated message from the contact form."
});
```

### Newsletter Updates

```typescript
// Weekly newsletter notification
await sendEmailToDefault({
  subject: "Weekly Finance Roundup",
  recipientName: "Tolga",
  content: "Here are this week's key market movements and insights...",
  buttonText: "Read Full Newsletter",
  buttonUrl: "https://newsletter.tolgatanagardigil.com/weekly",
  footerText: "You can manage your subscription preferences anytime."
});
```

## Troubleshooting

### Common Issues

1. **Email not sending**: Check RESEND_API_KEY environment variable
2. **Missing styles**: Ensure HTML template is being used correctly
3. **Form not working**: Check API endpoint and network requests in browser dev tools

### Debug Mode

Check the browser console and server logs for detailed error messages when emails fail to send.

---

The email template system is now fully integrated and ready to use throughout the application!
