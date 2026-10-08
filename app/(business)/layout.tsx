import { BusinessHeader } from "@/components/business/header";
import { BUSINESS_NAV } from "@/components/business/constant/business-nav.constant";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <DashboardSidebar items={BUSINESS_NAV} label="Business dashboard" />
      <div className="flex min-w-0 flex-1 flex-col">
        <BusinessHeader />
        <main className="w-full flex-1 px-4 py-4 sm:py-6">{children}</main>
      </div>
    </div>
  );
}
