import { PageSkeleton } from "@/components/admin/sidebar-skeleton";

export default function PostsLoading() {
  return (
    <PageSkeleton 
      showHeader={true}
      showStats={true}
      showTable={true}
      showCards={false}
    />
  );
}
