import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { ROADMAP_COPY } from "@/lib/roadmap.constant";
import { pageMetadata } from "@/lib/seo/metadata";

import { RoadmapGroup } from "./components/roadmap-group";

export const metadata: Metadata = pageMetadata({
  title: "What's coming to Nook",
  description: "New features on the way for people looking around and for local businesses on Nook.",
  path: ROADMAP_COPY.page,
});

export default function ComingSoonPage() {
  return (
    <Container className="max-w-4xl space-y-12 py-8 sm:py-12">
      <header className="max-w-2xl space-y-3">
        <h1>{ROADMAP_COPY.title}</h1>
        <p className="text-lg text-muted-foreground">{ROADMAP_COPY.lead}</p>
      </header>
      <Reveal>
        <RoadmapGroup audience="customers" />
      </Reveal>
      <Reveal>
        <RoadmapGroup audience="businesses" />
      </Reveal>
      <section aria-labelledby="idea" className="space-y-3 rounded-3xl bg-maroon-soft p-6 sm:p-8">
        <h2 id="idea">{ROADMAP_COPY.feedbackTitle}</h2>
        <p className="text-muted-foreground">{ROADMAP_COPY.feedbackText}</p>
        <Button nativeButton={false} render={<Link href="/contact" />}>
          {ROADMAP_COPY.feedbackAction}
        </Button>
      </section>
    </Container>
  );
}
