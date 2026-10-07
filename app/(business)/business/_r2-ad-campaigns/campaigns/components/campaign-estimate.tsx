"use client";

import { useWatch, type Control } from "react-hook-form";

import { formatMoney, parseMoney } from "@/lib/formatters/currency";
import { formatNumber } from "@/lib/formatters/number";
import type { CampaignInput } from "@/lib/validations/campaign.schema";

import { WALLET } from "../../dashboard/constant/dashboard.data";
import { CAMPAIGNS_COPY } from "../constant/campaign.constant";
import { estimate } from "../utils/campaign.utils";

const dash = (value: number | null) =>
  value === null ? "—" : formatNumber(value);

export function CampaignEstimate({
  control,
}: {
  control: Control<CampaignInput>;
}) {
  const [cpc, dailyBudget, totalBudget] = useWatch({
    control,
    name: ["cpc", "dailyBudget", "totalBudget"],
  });
  const { maxClicks, dailyClicks, days } = estimate({
    cpc,
    dailyBudget,
    totalBudget,
  });
  const total = parseMoney(totalBudget);
  const overWallet = total !== null && total > WALLET.balanceMinor;

  return (
    <aside className="space-y-4 rounded-xl border bg-surface p-4 lg:sticky lg:top-20 lg:self-start">
      <div>
        <h3>{CAMPAIGNS_COPY.estimateTitle}</h3>
        <p className="text-sm text-muted-foreground">
          {CAMPAIGNS_COPY.estimateHint}
        </p>
      </div>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Most paid clicks</dt>
          <dd className="font-semibold tabular-nums">{dash(maxClicks)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Clicks per day (max)</dt>
          <dd className="font-semibold tabular-nums">{dash(dailyClicks)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Days at daily limit</dt>
          <dd className="font-semibold tabular-nums">{dash(days)}</dd>
        </div>
      </dl>
      <div className="space-y-2 border-t pt-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">
            {CAMPAIGNS_COPY.walletLabel}
          </span>
          <span className="font-semibold tabular-nums">
            {formatMoney(WALLET.balanceMinor)}
          </span>
        </div>
        {overWallet && (
          <p
            role="status"
            className="rounded-lg bg-gold/15 px-3 py-2 text-xs text-[#8a6212]"
          >
            {CAMPAIGNS_COPY.walletWarning}
          </p>
        )}
      </div>
    </aside>
  );
}
