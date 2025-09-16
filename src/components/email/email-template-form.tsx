"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react";

interface EmailFormData {
  subject: string;
  recipientName: string;
  content: string;
  buttonText: string;
  buttonUrl: string;
  footerText: string;
  brandName: string;
}

interface EmailTemplateFormProps {
  onSuccess?: () => void;
  defaultRecipient?: string;
  className?: string;
}

export default function EmailTemplateForm({ 
  onSuccess,
  defaultRecipient = "ttanagardigil@urkatech.com",
  className = ""
}: EmailTemplateFormProps) {
  const [formData, setFormData] = useState<EmailFormData>({
    subject: "",
    recipientName: "",
    content: "",
    buttonText: "",
    buttonUrl: "",
    footerText: "",
    brandName: "Tolga Finance"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (field: keyof EmailFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear message when user starts typing
    if (message) {
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.content.trim()) {
      setMessage({ type: 'error', text: 'Subject and content are required.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: formData.subject.trim(),
          recipientName: formData.recipientName.trim() || undefined,
          content: formData.content.trim(),
          buttonText: formData.buttonText.trim() || undefined,
          buttonUrl: formData.buttonUrl.trim() || undefined,
          footerText: formData.footerText.trim() || undefined,
          brandName: formData.brandName.trim() || undefined,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({ type: 'success', text: `Email sent successfully to ${defaultRecipient}!` });
        // Reset form
        setFormData({
          subject: "",
          recipientName: "",
          content: "",
          buttonText: "",
          buttonUrl: "",
          footerText: "",
          brandName: "Tolga Finance"
        });
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to send email.' });
      }
    } catch (error) {
      console.error('Email send error:', error);
      setMessage({ type: 'error', text: 'Failed to send email. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    // Simple preview by opening in a new window (could be enhanced)
    const previewData = {
      subject: formData.subject,
      recipientName: formData.recipientName,
      content: formData.content,
      buttonText: formData.buttonText,
      buttonUrl: formData.buttonUrl,
      footerText: formData.footerText,
      brandName: formData.brandName
    };
    
    const previewWindow = window.open('', '_blank', 'width=600,height=800');
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head><title>Email Preview</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
            <h2>Email Preview</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p><strong>Subject:</strong> ${previewData.subject}</p>
              <p><strong>To:</strong> ${defaultRecipient}</p>
              <hr>
              <p><strong>Greeting:</strong> ${previewData.recipientName ? `Hi ${previewData.recipientName},` : 'Hello!'}</p>
              <p><strong>Content:</strong></p>
              <div style="white-space: pre-line; margin: 16px 0;">${previewData.content}</div>
              ${previewData.buttonText && previewData.buttonUrl ? `
                <p><strong>Button:</strong> <a href="${previewData.buttonUrl}" style="background: #0ea5e9; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px;">${previewData.buttonText}</a></p>
              ` : ''}
              ${previewData.footerText ? `<p><strong>Footer:</strong> ${previewData.footerText}</p>` : ''}
              <p><em>Brand: ${previewData.brandName}</em></p>
            </div>
          </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-blue-600" />
          <CardTitle>Send Email</CardTitle>
        </div>
        <CardDescription>
          Create and send an email using the template system. Recipient: {defaultRecipient}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Enter email subject"
                required
              />
            </div>

            <div>
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                type="text"
                value={formData.recipientName}
                onChange={(e) => handleInputChange('recipientName', e.target.value)}
                placeholder="Optional: Enter recipient's name for personalization"
              />
            </div>

            <div>
              <Label htmlFor="content">Email Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Enter the main email content..."
                rows={6}
                required
              />
            </div>
          </div>

          <Separator />

          {/* Optional Elements */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Optional Elements</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => handleInputChange('buttonText', e.target.value)}
                  placeholder="e.g., Visit Website"
                />
              </div>

              <div>
                <Label htmlFor="buttonUrl">Button URL</Label>
                <Input
                  id="buttonUrl"
                  type="url"
                  value={formData.buttonUrl}
                  onChange={(e) => handleInputChange('buttonUrl', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="footerText">Footer Text</Label>
              <Textarea
                id="footerText"
                value={formData.footerText}
                onChange={(e) => handleInputChange('footerText', e.target.value)}
                placeholder="Optional footer text or disclaimer"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="brandName">Brand Name</Label>
              <Input
                id="brandName"
                type="text"
                value={formData.brandName}
                onChange={(e) => handleInputChange('brandName', e.target.value)}
                placeholder="Brand name (defaults to 'Tolga Finance')"
              />
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
              {message.type === 'error' ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
              <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={handlePreview}
              disabled={!formData.subject.trim() || !formData.content.trim()}
            >
              Preview
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.subject.trim() || !formData.content.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}