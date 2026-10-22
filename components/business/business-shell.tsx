import { BUSINESS_NAV } from "@/components/business/constant/business-nav.constant";
import { BusinessHeader } from "@/components/business/header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

/** The business dashboard's frame: the side menu, the top bar and the page. Also used for a missing page inside the dashboard. */
export function BusinessShell({ children }: { children: React.ReactNode }) {
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
