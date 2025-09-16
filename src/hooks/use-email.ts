import { useState } from 'react';

interface EmailData {
  subject: string;
  recipientName?: string;
  content: string;
  buttonText?: string;
  buttonUrl?: string;
  footerText?: string;
  brandName?: string;
  to?: string;
}

interface UseEmailReturn {
  sendEmail: (data: EmailData) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  reset: () => void;
}

export function useEmail(): UseEmailReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendEmail = async (data: EmailData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        return { success: true };
      } else {
        const errorMessage = result.error || 'Failed to send email';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
    setIsLoading(false);
  };

  return {
    sendEmail,
    isLoading,
    error,
    success,
    reset,
  };
}

// Convenience hook for sending to the default recipient
export function useEmailToDefault() {
  const emailHook = useEmail();

  const sendEmailToDefault = async (data: Omit<EmailData, 'to'>) => {
    return emailHook.sendEmail({ ...data, to: 'ttanagardigil@urkatech.com' });
  };

  return {
    ...emailHook,
    sendEmail: sendEmailToDefault,
  };
}