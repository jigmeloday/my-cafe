import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { NO_INDEX, pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, businessSchema } from "@/lib/seo/schema";

import { BusinessProfileView } from "../components/business-profile-view";
import { getBusinessProfile } from "../utils/business.server";

// Real businesses are added at any time, so every page is read when asked for.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/businesses/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessProfile(slug);
  if (!business) return { title: "Place not found — Nook", ...NO_INDEX };
  const where = business.area ? ` in ${business.area}` : "";
  return pageMetadata({
    title: business.name,
    description: business.tagline || business.about[0] || `${business.name}${where}. See their deals, events and news on Nook.`,
    path: `/businesses/${slug}`,
    image: business.coverUrl ?? business.logoUrl,
  });
}

export default async function BusinessPage({
  params,
}: PageProps<"/businesses/[slug]">) {
  const { slug } = await params;
  const business = await getBusinessProfile(slug);
  if (!business) notFound();
  const seo = business.seo;
  const path = `/businesses/${slug}`;
  return (
    <>
      <JsonLd
        data={[
          businessSchema({ name: business.name, path, description: business.tagline || business.about[0], image: business.coverUrl ?? business.logoUrl, ...seo }),
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "New places", path: "/discover" }, { name: business.name, path }]),
        ]}
      />
      <BusinessProfileView business={business} />
    </>
  );
}
