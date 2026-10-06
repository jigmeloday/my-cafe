import type { Metadata } from "next";

import { PromotionExplorer } from "@/components/public/promotion-explorer";
import { Container } from "@/components/shared/container";

import { DEAL_FILTERS, DEALS_COPY } from "./constant/deals.constant";
import { DEALS } from "./constant/deals.data";

export const metadata: Metadata = {
  title: `${DEALS_COPY.title} — kuzu`,
  description: DEALS_COPY.description,
};

export default function DealsPage() {
  return (
    <Container className="space-y-8 py-8 sm:py-10">
      <header className="space-y-2">
        <h1>{DEALS_COPY.title}</h1>
        <p className="max-w-xl text-muted-foreground">
          {DEALS_COPY.description}
        </p>
      </header>
      <PromotionExplorer
        items={DEALS}
        filters={DEAL_FILTERS}
        copy={DEALS_COPY}
      />
    </Container>
  );
}
