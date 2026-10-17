import { DashboardMobileNav } from "@/components/dashboard/dashboard-mobile-nav";

import { AdminUserMenu } from "./admin-user-menu";
import { ADMIN_NAV, ADMIN_SHELL } from "./constant/admin-nav.constant";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-surface/95 px-4 backdrop-blur">
      <DashboardMobileNav items={ADMIN_NAV} label="Admin" />
      <p className="min-w-0 flex-1 truncate text-sm font-semibold">
        {ADMIN_SHELL.title}
      </p>
      <AdminUserMenu />
    </header>
  );
}
