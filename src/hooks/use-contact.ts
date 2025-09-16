import { useRouter } from 'next/navigation';

export function useContact() {
  const router = useRouter();

  const goToContact = (source?: string) => {
    // Optional: track where the contact button was clicked from
    if (source && typeof window !== 'undefined') {
      console.log(`Contact initiated from: ${source}`);
      // You can add analytics tracking here later
    }
    
    router.push('/contact#contact-form');
  };

  const goToContactWithMessage = (message: string, source?: string) => {
    // Store a pre-filled message in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('contact-prefill-message', message);
      if (source) {
        sessionStorage.setItem('contact-source', source);
      }
    }
    
    goToContact(source);
  };

  return {
    goToContact,
    goToContactWithMessage,
  };
}