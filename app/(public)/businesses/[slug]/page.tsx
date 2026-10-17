import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BusinessProfileView } from "../components/business-profile-view";
import { getBusinessProfile } from "../utils/business.server";

// Real businesses are added at any time, so every page is read when asked for.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/businesses/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessProfile(slug);
  return {
    title: business ? `${business.name} — kuzu` : "Place not found — kuzu",
  };
}

export default async function BusinessPage({
  params,
}: PageProps<"/businesses/[slug]">) {
  const { slug } = await params;
  const business = await getBusinessProfile(slug);
  if (!business) notFound();
  return <BusinessProfileView business={business} />;
}
