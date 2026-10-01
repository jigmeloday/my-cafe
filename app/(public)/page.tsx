import type { Metadata } from "next";

import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";

import { CtaBanner } from "./home/components/cta-banner";
import { ExploreAreas } from "./home/components/explore-areas";
import { HeroCarousel } from "./home/components/hero-carousel";
import { OfferRow } from "./home/components/offer-row";
import { OFFER_SECTIONS } from "./home/constant/offers.constant";

export const metadata: Metadata = {
  title: "kuzu — Discover what's happening",
  description:
    "Deals, events and new arrivals from local businesses in Bhutan.",
};

export default function HomePage() {
  return (
    <Container className="space-y-12 py-6 sm:space-y-16 sm:py-8">
      <HeroCarousel />
      {OFFER_SECTIONS.map((section) => (
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
