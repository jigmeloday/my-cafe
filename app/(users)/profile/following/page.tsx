import type { Metadata } from "next";

import { getEngagement } from "../utils/engagement.server";

import { FollowingList } from "../components/following-list";
import { ProfileSection } from "../components/profile-section";
import { PROFILE_COPY } from "../constant/profile.constant";

export const metadata: Metadata = { title: "Following — kuzu" };

export default async function FollowingPage() {
  const engagement = await getEngagement();
  if (!engagement) return null;

  return (
    <ProfileSection
      id="following"
      title={PROFILE_COPY.followingTitle}
      description={PROFILE_COPY.followingDescription}
    >
      <FollowingList places={engagement.following} />
    </ProfileSection>
  );
}
