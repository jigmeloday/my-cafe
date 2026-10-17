import { Brand } from "@/components/public/brand";

import { DashboardNav } from "./dashboard-nav";
import type { DashboardNavItem } from "./model/nav.type";

interface DashboardSidebarProps {
  items: DashboardNavItem[];
  label: string;
  /** Small tag next to the logo, e.g. "Admin". */
  badge?: string;
}

export function DashboardSidebar({
  items,
  label,
  badge,
}: DashboardSidebarProps) {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-6 border-r bg-surface px-4 py-5 lg:flex">
      <div className="flex items-center gap-2 px-3">
        <Brand />
        {badge && (
          <span className="rounded-full bg-maroon-soft px-2 py-0.5 text-xs font-semibold text-primary">
            {badge}
          </span>
        )}
      </div>
      <DashboardNav items={items} label={label} />
    </aside>
  );
}
