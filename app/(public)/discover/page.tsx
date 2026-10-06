import type { Metadata } from "next";

import { PromotionExplorer } from "@/components/public/promotion-explorer";
import { Container } from "@/components/shared/container";

import { DISCOVER_COPY, PLACE_FILTERS } from "./constant/discover.constant";
import { NEW_PLACES } from "./constant/discover.data";

export const metadata: Metadata = {
  title: `${DISCOVER_COPY.title} — kuzu`,
  description: DISCOVER_COPY.description,
};

export default function DiscoverPage() {
  return (
    <Container className="space-y-8 py-8 sm:py-10">
      <header className="space-y-2">
        <h1>{DISCOVER_COPY.title}</h1>
        <p className="max-w-xl text-muted-foreground">
          {DISCOVER_COPY.description}
        </p>
      </header>
      <PromotionExplorer
        items={NEW_PLACES}
        filters={PLACE_FILTERS}
        copy={DISCOVER_COPY}
      />
    </Container>
  );
}
