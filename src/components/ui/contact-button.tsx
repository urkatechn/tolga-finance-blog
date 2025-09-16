import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";

interface ContactButtonProps {
  children?: React.ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export default function ContactButton({ 
  children, 
  className = "text-lg px-8 py-6 h-auto",
  size = "lg" 
}: ContactButtonProps) {
  return (
    <Button 
      size={size} 
      className={className}
      asChild
    >
      <Link href="/contact#contact-form">
        {children || (
          <>
            <Mail className="mr-2 h-5 w-5" />
            Drop me a line
          </>
        )}
      </Link>
    </Button>
  );
}
