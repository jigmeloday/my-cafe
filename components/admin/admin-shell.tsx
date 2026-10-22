import { ADMIN_NAV } from "@/components/admin/constant/admin-nav.constant";
import { AdminHeader } from "@/components/admin/header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

/** The admin area's frame: the side menu, the top bar and the page. Also used for a missing page inside the admin area. */
export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <DashboardSidebar items={ADMIN_NAV} label="Admin" badge="Admin" />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />
        <main className="w-full flex-1 px-4 py-4 sm:py-6">{children}</main>
      </div>
    </div>
  );
}
