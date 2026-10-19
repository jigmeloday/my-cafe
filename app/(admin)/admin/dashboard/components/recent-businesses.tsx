import Link from "next/link";

import { SectionCard } from "@/components/business/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/formatters/date";
import type { Overview } from "@/services/admin/admin-overview.service";

import { BUSINESS_STATUS } from "../../businesses/constant/business.constant";
import { DASHBOARD_COPY } from "../constant/dashboard.constant";

export function RecentBusinesses({ businesses }: { businesses: Overview["newest"] }) {
  return (
    <SectionCard title={DASHBOARD_COPY.recentTitle}>
      {businesses.length === 0 ? (
        <p className="text-sm text-muted-foreground">{DASHBOARD_COPY.recentEmpty}</p>
      ) : (
        <ul className="divide-y">
          {businesses.map((b) => {
            const { label, tone } = BUSINESS_STATUS[b.status];
            return (
              <li key={b.id} className="flex items-center gap-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{b.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {[b.town, b.dzongkhag].filter(Boolean).join(", ") || "No address yet"} · {formatDate(b.joined)}
                  </p>
                </div>
                <StatusBadge tone={tone}>{label}</StatusBadge>
              </li>
            );
          })}
        </ul>
      )}
      <Link href="/admin/businesses" className="text-sm font-semibold text-primary hover:underline">
        {DASHBOARD_COPY.viewAll}
      </Link>
    </SectionCard>
  );
}
