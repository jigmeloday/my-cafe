"use client";

import { useWatch, type UseFormReturn } from "react-hook-form";

import { DateField } from "@/components/shared/date-field";
import { SelectField } from "@/components/shared/select-field";
import { todayIso } from "@/lib/formatters/date";
import { daysOfRun, FEATURED_HORIZON_DAYS, FEATURED_SLOTS_PER_DAY } from "@/lib/featured";
import type { PromotionInput } from "@/lib/validations/promotion.schema";
import type { OwnBooking } from "@/services/featured/featured.service";

import { FEATURE_COPY, FEATURE_OPTIONS } from "../constant/promotion.constant";
import { formatDateRange } from "../utils/promotion.utils";

interface FeatureFieldsProps {
  form: UseFormReturn<PromotionInput>;
  /** Places left on each day ("YYYY-MM-DD"). A guide only: the real check happens when saving. */
  availability: Record<string, number>;
  /** Bookings this promotion already has. */
  bookings: OwnBooking[];
}

const shortDay = (iso: string) => formatDateRange({ startDate: iso, endDate: iso }).split(" – ")[0];

export function FeatureFields({ form, availability, bookings }: FeatureFieldsProps) {
  const {
    control,
    formState: { errors },
  } = form;
  const [featureDays, featureStart] = useWatch({ control, name: ["featureDays", "featureStart"] });
  const days = Number(featureDays);

  // Which of the chosen days are already full, and how many places the tightest day has left.
  const run = days > 0 && /^\d{4}-\d{2}-\d{2}$/.test(featureStart) ? daysOfRun(featureStart, days) : [];
  const left = run.map((d) => availability[d] ?? FEATURED_SLOTS_PER_DAY);
  const soldOut = run.filter((_, i) => left[i] <= 0);
  const tightest = left.length ? Math.min(...left) : null;

  return (
    <div className="space-y-4">
      {bookings.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Already featured: {bookings.map((b) => (b.start === b.end ? shortDay(b.start) : `${shortDay(b.start)} – ${shortDay(b.end)}`)).join(", ")}.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField control={control} name="featureDays" label="Feature for" options={FEATURE_OPTIONS} error={errors.featureDays?.message} />
        {days > 0 && (
          <DateField
            control={control}
            name="featureStart"
            label="First day"
            min={todayIso()}
            max={shortMax()}
            error={errors.featureStart?.message}
          />
        )}
      </div>
      {days > 0 && soldOut.length > 0 && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Featured places are full on {soldOut.map(shortDay).join(", ")}. Choose other days.
        </p>
      )}
      {days > 0 && soldOut.length === 0 && tightest !== null && (
        <p className="text-sm text-muted-foreground">
          {tightest <= 3 ? `Only ${tightest} ${tightest === 1 ? "place" : "places"} left on the busiest of these days.` : "Places are available on these days."}
        </p>
      )}
      <p className="text-xs text-muted-foreground">{FEATURE_COPY.note(FEATURED_SLOTS_PER_DAY)}</p>
    </div>
  );
}

/** The last day that can be booked, "YYYY-MM-DD". */
function shortMax() {
  const end = new Date();
  end.setDate(end.getDate() + FEATURED_HORIZON_DAYS - 1);
  return `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}`;
}
