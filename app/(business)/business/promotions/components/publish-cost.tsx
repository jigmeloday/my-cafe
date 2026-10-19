import { CoinCostSummary } from "@/components/business/coin-cost-summary";
import { formatCoins } from "@/lib/formatters/number";

import { PUBLISH_COPY } from "../constant/promotion.constant";

interface PublishCostProps {
  /** Coins in the business wallet. */
  balance: number;
  /** Coins charged for going live. 0 when the promotion is already live. */
  publishFee: number;
  /** Coins for featuring on the home page. 0 when not featured. */
  featuredFee: number;
}

/** What publishing (and featuring) will cost, against what the wallet holds. */
export function PublishCost({ balance, publishFee, featuredFee }: PublishCostProps) {
  const total = publishFee + featuredFee;
  if (total === 0) return <p className="text-sm text-muted-foreground">{PUBLISH_COPY.alreadyLive}</p>;

  return (
    <div className="space-y-3">
      {featuredFee > 0 && (
        <ul className="space-y-1 text-sm text-muted-foreground">
          {publishFee > 0 && (
            <li className="flex justify-between gap-4">
              <span>Publishing</span>
              <span className="tabular-nums">{formatCoins(publishFee)}</span>
            </li>
          )}
          <li className="flex justify-between gap-4">
            <span>Featured on the home page</span>
            <span className="tabular-nums">{formatCoins(featuredFee)}</span>
          </li>
        </ul>
      )}
      <CoinCostSummary cost={total} balance={balance} label={PUBLISH_COPY.cost} />
    </div>
  );
}
