import Link from "next/link";

import { BreakdownList } from "@/components/business/charts/breakdown-list";
import type { BarItem } from "@/components/business/charts/model/chart.type";
import { SectionCard } from "@/components/business/section-card";
import { formatCoins } from "@/lib/formatters/number";

import { TRANSACTION_TYPE } from "../../wallet/constant/wallet.constant";
import { COIN_TRANSACTIONS } from "../../wallet/constant/wallet.data";
import { ANALYTICS_COPY } from "../constant/analytics.constant";

function spentByType(): BarItem[] {
  const totals = new Map<string, number>();
  for (const t of COIN_TRANSACTIONS) {
    if (t.amount < 0) totals.set(t.type, (totals.get(t.type) ?? 0) - t.amount);
  }
  return [...totals.entries()]
    .map(([type, value]) => ({
      id: type,
      label: TRANSACTION_TYPE[type as keyof typeof TRANSACTION_TYPE].label,
      value,
    }))
    .sort((a, b) => b.value - a.value);
}

export function CoinsCard() {
  const rows = spentByType();
  const total = rows.reduce((sum, r) => sum + r.value, 0);

  return (
    <SectionCard title={ANALYTICS_COPY.coinsTitle}>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {ANALYTICS_COPY.noCoins}
        </p>
      ) : (
        <>
          <p className="text-2xl font-semibold tabular-nums">
            {formatCoins(total)}
          </p>
          <BreakdownList rows={rows} kind="coins" barClassName="bg-gold" />
        </>
      )}
      <Link
        href="/business/transactions"
        className="text-sm font-semibold text-primary hover:underline"
      >
        View transactions
      </Link>
    </SectionCard>
  );
}
