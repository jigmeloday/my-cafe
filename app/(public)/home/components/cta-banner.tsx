import Link from "next/link";

import { Button } from "@/components/ui/button";

import { CTA_BANNER } from "../constant/hero.constant";

export function CtaBanner() {
  const { imageUrl } = CTA_BANNER;
  return (
    <section className={`grid overflow-hidden rounded-3xl bg-muted ${imageUrl ? "md:grid-cols-2" : ""}`}>
      <div className="space-y-4 p-6 sm:p-10 lg:p-12">
        <h2>{CTA_BANNER.title}</h2>
        <p className="max-w-xl text-muted-foreground">{CTA_BANNER.description}</p>
        <Button render={<Link href={CTA_BANNER.href} />} size="lg">
          {CTA_BANNER.cta}
        </Button>
      </div>
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={CTA_BANNER.imageAlt} loading="lazy" className="min-h-48 size-full object-cover" />
      )}
    </section>
  );
}
