import { CoinCostSummary } from "@/components/business/coin-cost-summary";

import { PUBLISH_COPY } from "../constant/promotion.constant";

interface PublishCostProps {
  /** Coins in the business wallet. */
  balance: number;
  /** Coins charged for going live. 0 when the promotion is already live. */
  publishFee: number;
}

/** What publishing will cost, against what the wallet holds. */
export function PublishCost({ balance, publishFee }: PublishCostProps) {
  if (publishFee === 0) return <p className="text-sm text-muted-foreground">{PUBLISH_COPY.alreadyLive}</p>;
  return <CoinCostSummary cost={publishFee} balance={balance} label={PUBLISH_COPY.cost} />;
}
