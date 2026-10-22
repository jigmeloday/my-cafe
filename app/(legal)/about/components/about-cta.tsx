import Link from "next/link";

import { Button } from "@/components/ui/button";

import { ABOUT_COPY } from "../constant/about.constant";

const { ctaPeople, ctaBusiness } = ABOUT_COPY;

/** Two ways in, one for each kind of visitor. */
export function AboutCta() {
  return (
    <section aria-labelledby="cta" className="space-y-6">
      <h2 id="cta">{ABOUT_COPY.ctaTitle}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4 rounded-3xl bg-maroon-soft p-6 sm:p-8">
          <div className="space-y-1">
            <h3>{ctaPeople.title}</h3>
            <p className="text-muted-foreground">{ctaPeople.text}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button nativeButton={false} render={<Link href="/deals" />}>
              {ctaPeople.browse}
            </Button>
            <Button variant="secondary" nativeButton={false} render={<Link href="/events" />}>
              {ctaPeople.events}
            </Button>
          </div>
        </div>
        <div className="space-y-4 rounded-3xl bg-primary p-6 text-primary-foreground sm:p-8">
          <div className="space-y-1">
            <h3 className="text-primary-foreground">{ctaBusiness.title}</h3>
            <p className="text-primary-foreground/85">{ctaBusiness.text}</p>
          </div>
          <Button variant="secondary" nativeButton={false} render={<Link href="/register" />}>
            {ctaBusiness.action}
          </Button>
        </div>
      </div>
    </section>
  );
}
