import type { Metadata } from "next";

import { Container } from "@/components/shared/container";
import { JsonLd } from "@/components/seo/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { pageMetadata } from "@/lib/seo/metadata";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";
import { discoveryService } from "@/services/discovery/discovery.service";

import { CategoryChips } from "./home/components/category-chips";
import { CtaBanner } from "./home/components/cta-banner";
import { ExploreAreas } from "./home/components/explore-areas";
import { HeroCarousel } from "./home/components/hero-carousel";
import { OfferRow } from "./home/components/offer-row";
import { HOME_SECTIONS } from "./home/constant/offers.constant";

export const metadata: Metadata = pageMetadata({
  title: "Discover what's happening in Bhutan",
  description: "Deals, events and new arrivals from local businesses in Bhutan. Find what's on near you, save what you like and follow your favourite places.",
  path: "/",
});

// New promotions appear as soon as they are published, so this page is built per request.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [landing, areas, categories] = await Promise.all([discoveryService.landing(), discoveryService.areas(), discoveryService.categories()]);
  const sections = HOME_SECTIONS.map((s) => ({ ...s, items: landing[s.key] })).filter((s) => s.items.length > 0);

  return (
    <Container className="space-y-12 py-6 sm:space-y-16 sm:py-8">
      <JsonLd data={[websiteSchema(), organizationSchema()]} />
      {categories.length > 0 && <CategoryChips categories={categories} />}
      {landing.hero.length > 0 && <HeroCarousel slides={landing.hero} />}
      {sections.map((section) => (
        <Reveal key={section.id}>
          <OfferRow section={section} />
        </Reveal>
      ))}
      <Reveal>
        <CtaBanner />
      </Reveal>
      {areas.length > 0 && (
        <Reveal>
          <ExploreAreas areas={areas} />
        </Reveal>
      )}
    </Container>
  );
}
