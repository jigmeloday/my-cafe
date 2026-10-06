import type { Metadata } from "next";

import { SavedOffers } from "../components/saved-offers";
import { ProfileSection } from "../components/profile-section";
import { PROFILE_COPY } from "../constant/profile.constant";

export const metadata: Metadata = { title: "Favorites — kuzu" };

export default function FavoritesPage() {
  return (
    <ProfileSection
      id="favorites"
      title={PROFILE_COPY.savedTitle}
      description={PROFILE_COPY.savedDescription}
    >
      <SavedOffers />
    </ProfileSection>
  );
}
