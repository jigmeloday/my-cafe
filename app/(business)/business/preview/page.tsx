import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/session";
import { getOwnBusiness } from "@/services/business/own-business";

import { BusinessProfileView } from "@/app/(public)/businesses/components/business-profile-view";
import { getBusinessProfile } from "@/app/(public)/businesses/utils/business.server";

export const metadata: Metadata = { title: "Preview your page — kuzu business" };

/** How your public page looks to customers, shown inside the dashboard (business owners don't browse the public site). */
export default async function PreviewPage() {
  await requireRole("BUSINESS_OWNER");
  const own = await getOwnBusiness();
  const business = own ? await getBusinessProfile(own.slug) : null;

  if (!business) {
    return (
      <EmptyState
        title="Nothing to preview yet"
        description="Save your business profile first, then your page appears here."
        action={<Button render={<Link href="/business/profile" />}>Business profile</Button>}
      />
    );
  }
  // Inside the preview, offers open the preview of that promotion (owners don't browse the public site).
  const inPreview = { ...business, activity: business.activity.map((a) => ({ ...a, href: a.href.replace(/^\/(promotions|events)\//, "/business/preview/") })) };
  return <BusinessProfileView business={inPreview} />;
}
