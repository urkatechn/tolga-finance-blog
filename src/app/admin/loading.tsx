import { PageSkeleton } from "@/components/admin/sidebar-skeleton";

export default function DashboardLoading() {
  return (
    <PageSkeleton 
      showHeader={true}
      showStats={true}
      showTable={false}
      showCards={true}
      cardCount={6}
    />
  );
}
