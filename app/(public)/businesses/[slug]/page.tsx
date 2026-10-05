import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BusinessProfileView } from "../components/business-profile-view";
import { allBusinessSlugs, getBusinessProfile } from "../utils/business.utils";

export const generateStaticParams = () =>
  allBusinessSlugs().map((slug) => ({ slug }));

export async function generateMetadata({
  params,
}: PageProps<"/businesses/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const business = getBusinessProfile(slug);
  return {
    title: business ? `${business.name} — kuzu` : "Place not found — kuzu",
  };
}

export default async function BusinessPage({
  params,
}: PageProps<"/businesses/[slug]">) {
  const { slug } = await params;
  const business = getBusinessProfile(slug);
  if (!business) notFound();
  return <BusinessProfileView business={business} />;
}
