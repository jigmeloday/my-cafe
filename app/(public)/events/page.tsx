import type { Metadata } from "next";

import { PromotionExplorer } from "@/components/public/promotion-explorer";
import { Container } from "@/components/shared/container";

import { EVENT_FILTERS, EVENTS_COPY } from "./constant/events.constant";
import { EVENTS } from "./constant/events.data";

export const metadata: Metadata = {
  title: `${EVENTS_COPY.title} — kuzu`,
  description: EVENTS_COPY.description,
};

export default function EventsPage() {
  return (
    <Container className="space-y-8 py-8 sm:py-10">
      <header className="space-y-2">
        <h1>{EVENTS_COPY.title}</h1>
        <p className="max-w-xl text-muted-foreground">
          {EVENTS_COPY.description}
        </p>
      </header>
      <PromotionExplorer
        items={EVENTS}
        filters={EVENT_FILTERS}
        copy={EVENTS_COPY}
      />
    </Container>
  );
}
