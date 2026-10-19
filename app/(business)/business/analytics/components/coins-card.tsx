import Link from "next/link";

import { BreakdownList } from "@/components/business/charts/breakdown-list";
import type { BarItem } from "@/components/business/charts/model/chart.type";
import { SectionCard } from "@/components/business/section-card";
import { formatCoins } from "@/lib/formatters/number";

import { TRANSACTION_TYPE } from "../../wallet/constant/wallet.constant";
import { ANALYTICS_COPY } from "../constant/analytics.constant";

/** Coins spent so far, by what they paid for. `rows` carry the transaction type in `id`. */
export function CoinsCard({ rows }: { rows: BarItem[] }) {
  const labelled = rows.map((r) => ({ ...r, label: TRANSACTION_TYPE[r.id as keyof typeof TRANSACTION_TYPE]?.label ?? r.label }));
  const total = labelled.reduce((sum, r) => sum + r.value, 0);

  return (
    <SectionCard title={ANALYTICS_COPY.coinsTitle}>
      {labelled.length === 0 ? (
        <p className="text-sm text-muted-foreground">{ANALYTICS_COPY.noCoins}</p>
      ) : (
        <>
          <p className="text-2xl font-semibold tabular-nums">{formatCoins(total)}</p>
          <BreakdownList rows={labelled} kind="coins" barClassName="bg-gold" />
        </>
      )}
      <Link href="/business/transactions" className="text-sm font-semibold text-primary hover:underline">
        View transactions
      </Link>
    </SectionCard>
  );
}
