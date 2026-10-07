"use client";

import { useWatch, type UseFormReturn } from "react-hook-form";

import { CoinCostSummary } from "@/components/business/coin-cost-summary";
import { SelectField } from "@/components/shared/select-field";
import { SwitchField } from "@/components/shared/switch-field";
import { formatNumber } from "@/lib/formatters/number";
import type { PromotionInput } from "@/lib/validations/promotion.schema";

import { PROMOTE_COPY } from "../constant/promotion.constant";
import {
  allFollowerRecipients,
  BANNER_OPTIONS,
  promotionCoinCost,
  TOP_RANK_OPTIONS,
} from "../utils/promotion.utils";

export function PromoteFields({
  form,
}: {
  form: UseFormReturn<PromotionInput>;
}) {
  const {
    control,
    formState: { errors },
  } = form;
  const [emailFollowers, bannerDays, topRankDays] = useWatch({
    control,
    name: ["emailFollowers", "bannerDays", "topRankDays"],
  });
  const cost = promotionCoinCost({ emailFollowers, bannerDays, topRankDays });

  return (
    <div className="space-y-4">
      <div className="border-y">
        <SwitchField
          control={control}
          name="emailFollowers"
          label={PROMOTE_COPY.emailLabel}
          description={`${PROMOTE_COPY.emailHint} About ${formatNumber(allFollowerRecipients())} people.`}
        />
      </div>
      {errors.emailFollowers?.message && (
        <p role="alert" className="text-sm text-destructive">
          {errors.emailFollowers.message}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          control={control}
          name="bannerDays"
          label={PROMOTE_COPY.bannerLabel}
          options={BANNER_OPTIONS}
          error={errors.bannerDays?.message}
        />
        <SelectField
          control={control}
          name="topRankDays"
          label={PROMOTE_COPY.topRankLabel}
          options={TOP_RANK_OPTIONS}
          error={errors.topRankDays?.message}
        />
      </div>
      {cost > 0 ? (
        <CoinCostSummary cost={cost} label={PROMOTE_COPY.total} />
      ) : (
        <p className="text-sm text-muted-foreground">{PROMOTE_COPY.free}</p>
      )}
    </div>
  );
}
