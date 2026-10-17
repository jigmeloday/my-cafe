import type { Metadata } from "next";

import { getCurrentBusiness } from "@/services/business/current-business";

import { ProfileHeader } from "./components/profile-header";
import { ProfileTabs } from "./components/profile-tabs";

export const metadata: Metadata = { title: "Business profile — kuzu business" };

export default async function BusinessProfilePage() {
  const { data, slug, media } = await getCurrentBusiness();

  return (
    <div className="space-y-6">
      <ProfileHeader slug={slug} />
      <ProfileTabs data={data} media={media} />
    </div>
  );
}
