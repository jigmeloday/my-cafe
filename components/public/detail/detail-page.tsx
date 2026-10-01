import { Container } from "@/components/shared/container";

import { DETAIL_KINDS } from "../constant/detail.constant";
import type { DetailData } from "../model/detail.type";
import { DetailAside } from "./detail-aside";
import { DetailFacts } from "./detail-facts";
import { DetailGallery } from "./detail-gallery";
import { DetailHeader } from "./detail-header";
import { RelatedGrid } from "./related-grid";

export function DetailPage({ detail }: { detail: DetailData }) {
  const config = DETAIL_KINDS[detail.kind];

  return (
    <Container className="space-y-10 py-6 sm:py-8">
      <DetailHeader detail={detail} />
      <DetailGallery />
      <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-16">
        <div className="space-y-8">
          <DetailFacts facts={detail.facts} />
          <div className="max-w-2xl space-y-4 text-muted-foreground">
            {detail.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <DetailAside detail={detail} />
      </div>
      <RelatedGrid title={config.relatedTitle} items={detail.related} />
    </Container>
  );
}
