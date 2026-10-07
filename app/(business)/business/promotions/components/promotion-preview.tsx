"use client";

import { useWatch, type Control } from "react-hook-form";

import { PromotionCard } from "@/components/public/promotion-card";
import type { PromotionInput } from "@/lib/validations/promotion.schema";

import { PROMOTIONS_COPY, TYPE_OPTIONS } from "../constant/promotion.constant";
import { formatDateRange } from "../utils/promotion.utils";

export function PromotionPreview({
  control,
}: {
  control: Control<PromotionInput>;
}) {
  const [title, type, discount, location, startDate, endDate] = useWatch({
    control,
    name: ["title", "type", "discount", "location", "startDate", "endDate"],
  });

  return (
    <aside className="space-y-3 lg:sticky lg:top-20 lg:self-start">
      <div>
        <h3>{PROMOTIONS_COPY.previewTitle}</h3>
        <p className="text-sm text-muted-foreground">
          {PROMOTIONS_COPY.previewHint}
        </p>
      </div>
      <PromotionCard
        className="max-w-60"
        item={{
          id: "preview",
          badge: TYPE_OPTIONS.find((t) => t.value === type)?.label,
          title: title || "Your promotion title",
          meta: [
            location || "Location",
            formatDateRange({ startDate, endDate }),
          ],
          highlight: discount || "Offer",
          href: "#",
        }}
      />
    </aside>
  );
}
