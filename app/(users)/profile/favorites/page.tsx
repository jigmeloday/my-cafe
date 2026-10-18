import type { Metadata } from "next";
import { requireRole } from "@/lib/session";

import { getEngagement } from "../utils/engagement.server";

import { SavedOffers } from "../components/saved-offers";
import { ProfileSection } from "../components/profile-section";
import { PROFILE_COPY } from "../constant/profile.constant";

export const metadata: Metadata = { title: "Favorites — kuzu" };

export default async function FavoritesPage() {
  // The layout checks this too, but a page must not rely on that.
  await requireRole("USER", "ADMIN");
  const engagement = await getEngagement();
  if (!engagement) return null;

  return (
    <ProfileSection
      id="favorites"
      title={PROFILE_COPY.savedTitle}
      description={PROFILE_COPY.savedDescription}
    >
      <SavedOffers items={engagement.favorites} />
    </ProfileSection>
  );
}
