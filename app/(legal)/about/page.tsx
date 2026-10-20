import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { LEGAL } from "@/lib/legal";

import { AboutStats } from "./components/about-stats";
import { AboutSteps } from "./components/about-steps";
import { ABOUT_COPY } from "./constant/about.constant";

export const metadata: Metadata = pageMetadata({ title: "About", description: "Nook helps people in Bhutan find deals, events and new places, and helps local businesses tell them about it.", path: "/about" });

// The totals change as businesses join, so this page is built per request.
export const dynamic = "force-dynamic";

export default function AboutPage() {
  return (
    <Container className="max-w-4xl space-y-14 py-8 sm:py-12">
      <header className="max-w-2xl space-y-4">
        <h1>{ABOUT_COPY.title}</h1>
        <p className="text-lg text-muted-foreground">{ABOUT_COPY.lead}</p>
      </header>

      <section aria-label="Our story" className="max-w-2xl space-y-4 text-muted-foreground">
        {ABOUT_COPY.story.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <AboutStats />

      <AboutSteps id="customers" title={ABOUT_COPY.customersTitle} steps={ABOUT_COPY.customers} />
      <AboutSteps id="businesses" title={ABOUT_COPY.businessesTitle} steps={ABOUT_COPY.businesses} />

      <section aria-labelledby="trust" className="space-y-5">
        <h2 id="trust">{ABOUT_COPY.trustTitle}</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {ABOUT_COPY.trust.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4 rounded-2xl border bg-surface p-5">
              <Icon className="mt-0.5 size-6 shrink-0 text-primary" />
              <div className="space-y-1">
                <h3>{title}</h3>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ul>
        <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground">
          {ABOUT_COPY.stand.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          Read the details in our{" "}
          <Link href="/terms" className="font-medium text-foreground underline underline-offset-2">
            terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium text-foreground underline underline-offset-2">
            privacy policy
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="cta" className="space-y-4 rounded-3xl bg-maroon-soft p-6 sm:p-8">
        <h2 id="cta">{ABOUT_COPY.ctaTitle}</h2>
        <div className="flex flex-wrap gap-3">
          <Button nativeButton={false} render={<Link href="/deals" />}>
            Browse deals
          </Button>
          <Button variant="secondary" nativeButton={false} render={<Link href="/events" />}>
            See events
          </Button>
          <Button variant="secondary" nativeButton={false} render={<Link href="/register" />}>
            List your business
          </Button>
        </div>
      </section>

      <section aria-labelledby="contact" className="space-y-2 text-sm text-muted-foreground">
        <h2 id="contact" className="text-base text-foreground">
          {ABOUT_COPY.contactTitle}
        </h2>
        <p>
          {LEGAL.company}, {LEGAL.address}
          <br />
          {LEGAL.contactEmail}
        </p>
      </section>
    </Container>
  );
}
