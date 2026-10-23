import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Photo } from "@/components/shared/photo";

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
        <Photo src={imageUrl} alt={CTA_BANNER.imageAlt} sizes="(min-width: 768px) 50vw, 100vw" className="min-h-48 size-full" />
      )}
    </section>
  );
}
