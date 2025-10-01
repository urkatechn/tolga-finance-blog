export function subscriptionWelcomeEmailHtml(opts: { unsubscribeUrl: string; brandName?: string }) {
  const { unsubscribeUrl, brandName = "Tolga Tangardigil" } = opts;
  const preview = `Welcome to ${brandName}!`;
  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif; background:#f8fafc; padding:24px;">
    <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;">${preview}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
      <tr>
        <td style="padding:22px 24px;background:#0f172a;color:#e2e8f0;">
          <strong style="font-size:16px;">${brandName}</strong>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 28px 8px 28px;">
          <h1 style="margin:0;font-size:22px;color:#0f172a;">Thanks for subscribing 🎉</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:0 28px 20px 28px;color:#334155;line-height:1.6;font-size:16px;">
          <p style="margin:0 0 12px 0;">You’re now subscribed to receive new posts and market insights.</p>
          <p style="margin:0;">If this wasn’t you or you no longer wish to receive emails, you can unsubscribe anytime below.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 28px 28px 28px;">
          <a href="${unsubscribeUrl}"
             style="display:inline-block;background:#ef4444;color:#fff;text-decoration:none;padding:10px 14px;border-radius:8px;font-weight:600;font-size:14px">
            Unsubscribe
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px;background:#f1f5f9;color:#64748b;font-size:12px;">
          You can unsubscribe at any time using the link above. If you didn’t sign up, please click Unsubscribe to stop emails.
        </td>
      </tr>
    </table>
  </div>`;
}

export function subscriptionWelcomeEmailText(opts: { unsubscribeUrl: string; brandName?: string }) {
  const { unsubscribeUrl, brandName = "Tolga Tangardigil" } = opts;
  return [
    `Thanks for subscribing to ${brandName}!`,
    ``,
    `You're now subscribed to receive new posts and market insights.`,
    ``,
    `To unsubscribe at any time, visit: ${unsubscribeUrl}`,
  ].join("\n");
}

// Generic email template types
export interface EmailTemplateData {
  subject: string;
  recipientName?: string;
  content: string;
  buttonText?: string;
  buttonUrl?: string;
  footerText?: string;
  brandName?: string;
}

// Generic HTML email template
export function genericEmailHtml(data: EmailTemplateData) {
  const { 
    subject, 
    recipientName, 
    content, 
    buttonText, 
    buttonUrl, 
    footerText,
    brandName = "Tolga Tangardigil" 
  } = data;
  
  const preview = subject;
  const greeting = recipientName ? `Hi ${recipientName},` : "Hello!";
  
  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif; background:#f8fafc; padding:24px;">
    <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;">${preview}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
      <tr>
        <td style="padding:22px 24px;background:#0f172a;color:#e2e8f0;">
          <strong style="font-size:16px;">${brandName}</strong>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 28px 8px 28px;">
          <h1 style="margin:0;font-size:22px;color:#0f172a;">${subject}</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:0 28px 20px 28px;color:#334155;line-height:1.6;font-size:16px;">
          <p style="margin:0 0 16px 0;">${greeting}</p>
          <div style="white-space: pre-line;">${content}</div>
        </td>
      </tr>
      ${buttonText && buttonUrl ? `
      <tr>
        <td style="padding:0 28px 28px 28px;">
          <a href="${buttonUrl}"
             style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">
            ${buttonText}
          </a>
        </td>
      </tr>
      ` : ''}
      ${footerText ? `
      <tr>
        <td style="padding:16px 28px;background:#f1f5f9;color:#64748b;font-size:12px;line-height:1.5;">
          ${footerText}
        </td>
      </tr>
      ` : ''}
    </table>
  </div>`;
}

// Generic plain text email template
export function genericEmailText(data: EmailTemplateData) {
  const { 
    subject, 
    recipientName, 
    content, 
    buttonText, 
    buttonUrl, 
    footerText,
    brandName = "Tolga Tangardigil" 
  } = data;
  
  const greeting = recipientName ? `Hi ${recipientName},` : "Hello!";
  
  const lines = [
    `${brandName}`,
    ``,
    subject,
    ``,
    greeting,
    ``,
    content
  ];
  
  if (buttonText && buttonUrl) {
    lines.push(``);
    lines.push(`${buttonText}: ${buttonUrl}`);
  }
  
  if (footerText) {
    lines.push(``);
    lines.push(`---`);
    lines.push(footerText);
  }
  
  return lines.join("\n");
}
