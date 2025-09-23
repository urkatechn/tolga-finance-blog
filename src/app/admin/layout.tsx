import { AppSidebar } from "@/components/admin/sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { ErrorBoundary } from "@/components/error-boundary";

export const metadata = {
  title: "Admin Dashboard | Finance Blog",
  description: "Admin dashboard for managing the finance blog",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 pb-28">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
        {/* Global new post button - responsive */}
        <Button className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 shadow-lg" size="lg" asChild>
          <a href="/admin/posts/new" aria-label="Create new post">
            <Pencil className="mr-2 h-4 w-4" /> 
            <span className="hidden sm:inline">New Post</span>
            <span className="sm:hidden">New</span>
          </a>
        </Button>
      </SidebarInset>
    </SidebarProvider>
  );
}
