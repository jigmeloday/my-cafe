import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

import { CTA_BANNER } from "../constant/hero.constant";

export function CtaBanner() {
  return (
    <section className="grid overflow-hidden rounded-3xl bg-muted md:grid-cols-2">
      <div className="space-y-4 p-6 sm:p-10 lg:p-12">
        <h2>{CTA_BANNER.title}</h2>
        <p className="max-w-md text-muted-foreground">
          {CTA_BANNER.description}
        </p>
        <Button render={<Link href={CTA_BANNER.href} />} size="lg">
          {CTA_BANNER.cta}
        </Button>
      </div>
      <ImagePlaceholder
        label={CTA_BANNER.imageLabel}
        className="min-h-48 bg-foreground/10"
      />
    </section>
  );
}
