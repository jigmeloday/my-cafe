import type { Metadata } from "next";

import { NO_INDEX } from "@/lib/seo/metadata";
import { ADMIN_NAV } from "@/components/admin/constant/admin-nav.constant";
import { AdminHeader } from "@/components/admin/header";
import { guardArea } from "@/lib/session";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";


// Accounts and dashboards are private, so search engines are asked to leave them out.
export const metadata: Metadata = NO_INDEX;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await guardArea("admin");

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
