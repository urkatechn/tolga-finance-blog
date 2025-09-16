"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Info, TriangleAlert } from "lucide-react";

export default function UnsubscribeClient() {
  const params = useSearchParams();
  const status = params.get("status");

  const content = (() => {
    switch (status) {
      case "success":
        return {
          icon: <CheckCircle2 className="h-10 w-10 text-green-600" />,
          title: "You’re unsubscribed",
          description:
            "You will no longer receive emails from us. You can resubscribe anytime on the site.",
        };
      case "already":
        return {
          icon: <Info className="h-10 w-10 text-blue-600" />,
          title: "Already unsubscribed",
          description:
            "Your email was already unsubscribed. No further action is needed.",
        };
      case "invalid":
        return {
          icon: <TriangleAlert className="h-10 w-10 text-amber-600" />,
          title: "Invalid link",
          description:
            "This unsubscribe link is invalid or has expired. Please try again from a newer email.",
        };
      default:
        return {
          icon: <TriangleAlert className="h-10 w-10 text-amber-600" />,
          title: "Something went wrong",
          description: "We couldn’t process your request. Please try again later.",
        };
    }
  })();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="flex items-center text-center gap-3">
          {content.icon}
          <CardTitle className="text-2xl mt-2">{content.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p className="mb-6">{content.description}</p>
          <Button asChild>
            <Link href="/">Return to homepage</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

