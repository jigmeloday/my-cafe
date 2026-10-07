import Link from "next/link";

import { StatusBadge } from "@/components/shared/status-badge";
import { formatNumber } from "@/lib/formatters/number";

import {
  STATUS_LABELS,
  STATUS_TONES,
  TYPE_OPTIONS,
} from "../../promotions/constant/promotion.constant";
import { PROMOTION_ITEMS } from "../../promotions/constant/promotions.data";
import { DASHBOARD_COPY, RECENT_LIMIT } from "../constant/dashboard.constant";

export function PromotionsList() {
  return (
    <section
      aria-labelledby="dashboard-promotions"
      className="space-y-3 rounded-xl border bg-surface p-4 sm:p-5"
    >
      <div className="flex items-center justify-between">
        <h2 id="dashboard-promotions">{DASHBOARD_COPY.promotionsTitle}</h2>
        <Link
          href="/business/promotions"
          className="text-sm font-semibold text-primary hover:underline"
        >
          {DASHBOARD_COPY.viewAll}
        </Link>
      </div>
      <ul className="divide-y">
        {PROMOTION_ITEMS.slice(0, RECENT_LIMIT).map(
          ({ id, status, clicks, values }) => (
            <li key={id} className="flex items-center gap-4 py-3">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/business/promotions/${id}/edit`}
                  className="block truncate text-sm font-medium hover:underline"
                >
                  {values.title}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {TYPE_OPTIONS.find((t) => t.value === values.type)?.label} ·{" "}
                  {formatNumber(clicks)} clicks
                </p>
              </div>
              <StatusBadge tone={STATUS_TONES[status]}>
                {STATUS_LABELS[status]}
              </StatusBadge>
            </li>
          ),
        )}
      </ul>
    </section>
  );
}
