import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatNumber } from "@/lib/formatters/number";

import type { PromotionItem } from "../../promotions/model/promotion.type";
import { STATUS_LABELS, STATUS_TONES, TYPE_OPTIONS } from "../../promotions/constant/promotion.constant";
import { DASHBOARD_COPY, RECENT_LIMIT } from "../constant/dashboard.constant";

interface PromotionsListProps {
  items: PromotionItem[];
  /** Clicks in the dashboard period, by promotion id. */
  clicks: Record<string, number>;
}

export function PromotionsList({ items, clicks }: PromotionsListProps) {
  return (
    <section aria-labelledby="dashboard-promotions" className="space-y-3 rounded-xl border bg-surface p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h2 id="dashboard-promotions">{DASHBOARD_COPY.promotionsTitle}</h2>
        <Link href="/business/promotions" className="text-sm font-semibold text-primary hover:underline">
          {DASHBOARD_COPY.viewAll}
        </Link>
      </div>
      {items.length === 0 ? (
        <EmptyState title={DASHBOARD_COPY.noPromotionsTitle} description={DASHBOARD_COPY.noPromotionsDescription} />
      ) : (
        <ul className="divide-y">
          {items.slice(0, RECENT_LIMIT).map(({ id, status, values }) => (
            <li key={id} className="flex items-center gap-4 py-3">
              <div className="min-w-0 flex-1">
                <Link href={`/business/promotions/${id}/edit`} className="block truncate text-sm font-medium hover:underline">
                  {values.title}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {TYPE_OPTIONS.find((t) => t.value === values.type)?.label} · {formatNumber(clicks[id] ?? 0)} clicks
                </p>
              </div>
              <StatusBadge tone={STATUS_TONES[status]}>{STATUS_LABELS[status]}</StatusBadge>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
