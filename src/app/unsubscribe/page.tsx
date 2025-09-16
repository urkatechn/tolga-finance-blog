import { Suspense } from "react";
import UnsubscribeClient from "./_components/unsubscribe-client";

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center px-4">Loading...</div>}>
      <UnsubscribeClient />
    </Suspense>
  );
}
