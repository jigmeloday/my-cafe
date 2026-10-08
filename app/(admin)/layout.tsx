import { ADMIN_NAV } from "@/components/admin/constant/admin-nav.constant";
import { AdminHeader } from "@/components/admin/header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

// TODO: only let signed-in admins (role ADMIN) see this area. Right now anyone can open it.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
