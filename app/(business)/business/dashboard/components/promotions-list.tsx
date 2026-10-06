import Link from "next/link";

import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/formatters/number";

import { DASHBOARD_COPY } from "../constant/dashboard.constant";
import { PROMOTIONS } from "../constant/dashboard.data";

export function PromotionsList() {
  return (
    <section
      aria-labelledby="promotions"
      className="space-y-3 rounded-xl border bg-surface p-4 sm:p-5"
    >
      <div className="flex items-center justify-between">
        <h2 id="promotions">{DASHBOARD_COPY.promotionsTitle}</h2>
        <Link
          href="/business/promotions"
          className="text-sm font-semibold text-primary hover:underline"
        >
          {DASHBOARD_COPY.viewAll}
        </Link>
      </div>
      <ul className="divide-y">
        {PROMOTIONS.map((p) => (
          <li key={p.id} className="flex items-center gap-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{p.title}</p>
              <p className="text-xs text-muted-foreground">
                {p.type} · {formatNumber(p.clicks)} clicks
              </p>
            </div>
            <StatusBadge
              tone={p.status === "Published" ? "success" : "neutral"}
              className="hidden sm:inline-flex"
            >
              {p.status}
            </StatusBadge>
            {p.boosted ? (
              <StatusBadge tone="info">{DASHBOARD_COPY.boosted}</StatusBadge>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                disabled={p.status !== "Published"}
              >
                {DASHBOARD_COPY.boost}
              </Button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
