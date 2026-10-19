import type { Metadata } from "next";

import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { discoveryService } from "@/services/discovery/discovery.service";

import { CtaBanner } from "./home/components/cta-banner";
import { ExploreAreas } from "./home/components/explore-areas";
import { HeroCarousel } from "./home/components/hero-carousel";
import { OfferRow } from "./home/components/offer-row";
import { HOME_SECTIONS } from "./home/constant/offers.constant";

export const metadata: Metadata = {
  title: "kuzu — Discover what's happening",
  description: "Deals, events and new arrivals from local businesses in Bhutan.",
};

// New promotions appear as soon as they are published, so this page is built per request.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const landing = await discoveryService.landing();
  const sections = HOME_SECTIONS.map((s) => ({ ...s, items: landing[s.key] })).filter((s) => s.items.length > 0);

  return (
    <Container className="space-y-12 py-6 sm:space-y-16 sm:py-8">
      {landing.hero.length > 0 && <HeroCarousel slides={landing.hero} />}
      {sections.map((section) => (
        <Reveal key={section.id}>
          <OfferRow section={section} />
        </Reveal>
      ))}
      <Reveal>
        <CtaBanner />
      </Reveal>
      <Reveal>
        <ExploreAreas />
      </Reveal>
    </Container>
  );
}
