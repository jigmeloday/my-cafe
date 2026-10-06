"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { PromotionCard } from "@/components/public/promotion-card";
import { ScrollArrows } from "@/components/shared/scroll-arrows";
import { useScrollRow } from "@/hooks/use-scroll-row";

import { OFFER_CARD_WIDTH } from "../constant/offers.constant";
import type { OfferSectionData } from "../model/home.type";

export function OfferRow({ section }: { section: OfferSectionData }) {
  const { ref, canPrev, canNext, scrollPrev, scrollNext } =
    useScrollRow<HTMLDivElement>();

  return (
    <section aria-labelledby={section.id} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 id={section.id}>
          <Link href={section.href} className="inline-flex items-center gap-1">
            {section.title} <ChevronRight className="size-5" />
          </Link>
        </h2>
        <div className="hidden sm:block">
          <ScrollArrows
            canPrev={canPrev}
            canNext={canNext}
            onPrev={scrollPrev}
            onNext={scrollNext}
          />
        </div>
      </div>
      <div
        ref={ref}
        className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-2"
      >
        {section.items.map((item) => (
          <PromotionCard
            key={item.id}
            item={item}
            className={OFFER_CARD_WIDTH}
          />
        ))}
      </div>
    </section>
  );
}
