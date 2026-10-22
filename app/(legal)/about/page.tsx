import type { Metadata } from "next";

import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { pageMetadata } from "@/lib/seo/metadata";
import { discoveryService } from "@/services/discovery/discovery.service";

import { AboutContact } from "./components/about-contact";
import { AboutContrast } from "./components/about-contrast";
import { AboutCta } from "./components/about-cta";
import { AboutHero } from "./components/about-hero";
import { AboutHow } from "./components/about-how";
import { AboutNext } from "./components/about-next";
import { AboutPillars } from "./components/about-pillars";
import { AboutTrust } from "./components/about-trust";
import { heroTiles } from "./utils/about.utils";

export const metadata: Metadata = pageMetadata({
  title: "About Nook: everything happening in Bhutan",
  description: "Nook is Bhutan's discovery portal. Find deals, events and new places near you, and help local businesses get found.",
  path: "/about",
});

// The totals change as businesses join, so this page is built per request.
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const tiles = heroTiles(await discoveryService.siteStats());

  return (
    <Container className="max-w-6xl space-y-16 py-6 sm:space-y-20 sm:py-10">
      <AboutHero tiles={tiles} />
      <Reveal>
        <AboutPillars />
      </Reveal>
      <Reveal>
        <AboutContrast />
      </Reveal>
      <Reveal>
        <AboutHow />
      </Reveal>
      <Reveal>
        <AboutTrust />
      </Reveal>
      <Reveal>
        <AboutNext />
      </Reveal>
      <Reveal>
        <AboutCta />
      </Reveal>
      <AboutContact />
    </Container>
  );
}
