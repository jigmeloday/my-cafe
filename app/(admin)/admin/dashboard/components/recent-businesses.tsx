import Link from "next/link";

import { SectionCard } from "@/components/business/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/formatters/date";

import { BUSINESS_STATUS } from "../../businesses/constant/business.constant";
import { DASHBOARD_COPY } from "../constant/dashboard.constant";
import { newestBusinesses } from "../utils/dashboard.utils";

export function RecentBusinesses() {
  return (
    <SectionCard title={DASHBOARD_COPY.recentTitle}>
      <ul className="divide-y">
        {newestBusinesses().map((b) => {
          const { label, tone } = BUSINESS_STATUS[b.status];
          return (
            <li key={b.id} className="flex items-center gap-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{b.name}</p>
                <p className="text-xs text-muted-foreground">
                  {b.category} · {b.dzongkhag} · {formatDate(b.joined)}
                </p>
              </div>
              <StatusBadge tone={tone}>{label}</StatusBadge>
            </li>
          );
        })}
      </ul>
      <Link
        href="/admin/businesses"
        className="text-sm font-semibold text-primary hover:underline"
      >
        {DASHBOARD_COPY.viewAll}
      </Link>
    </SectionCard>
  );
}
