import { RelatedGrid } from "@/components/public/detail/related-grid";
import { Container } from "@/components/shared/container";

import { BUSINESS_COPY } from "../constant/business.constant";
import type { BusinessProfile } from "../model/business.type";
import { BusinessActivity } from "./business-activity";
import { BusinessCover } from "./business-cover";
import { BusinessGallery } from "./business-gallery";
import { BusinessHeader } from "./business-header";
import { BusinessInfoCard } from "./business-info-card";
import { BusinessSection } from "./business-section";

export function BusinessProfileView({
  business,
}: {
  business: BusinessProfile;
}) {
  return (
    <Container className="max-w-6xl space-y-8 py-6 sm:py-8">
      <div>
        <BusinessCover name={business.name} />
        <BusinessHeader business={business} />
      </div>
      <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-8">
          <BusinessSection id="about" title={BUSINESS_COPY.about}>
            <div className="max-w-2xl space-y-3 text-muted-foreground">
              {business.about.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          </BusinessSection>
          <BusinessSection id="activity" title={BUSINESS_COPY.activity}>
            <BusinessActivity items={business.activity} />
          </BusinessSection>
          <BusinessSection id="photos" title={BUSINESS_COPY.gallery}>
            <BusinessGallery />
          </BusinessSection>
        </div>
        <BusinessInfoCard hours={business.hours} />
      </div>
      <RelatedGrid title={BUSINESS_COPY.similar} items={business.similar} />
    </Container>
  );
}
