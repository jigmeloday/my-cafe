"use client";

import type { UseFormReturn } from "react-hook-form";

import { MoneyField } from "@/components/shared/money-field";
import { formatMoney } from "@/lib/formatters/currency";
import { MIN_CPC_MINOR } from "@/lib/constants";
import type { CampaignInput } from "@/lib/validations/campaign.schema";

export function BudgetFields({ form }: { form: UseFormReturn<CampaignInput> }) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <MoneyField
        id="cpc"
        label="Price per click"
        hint={`Minimum ${formatMoney(MIN_CPC_MINOR)}`}
        error={errors.cpc?.message}
        {...register("cpc")}
      />
      <MoneyField
        id="totalBudget"
        label="Total budget"
        hint="The most this campaign can spend."
        error={errors.totalBudget?.message}
        {...register("totalBudget")}
      />
      <MoneyField
        id="dailyBudget"
        label="Daily budget"
        hint="Optional daily limit."
        error={errors.dailyBudget?.message}
        {...register("dailyBudget")}
      />
    </div>
  );
}
