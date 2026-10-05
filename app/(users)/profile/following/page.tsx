import type { Metadata } from "next";

import { FollowingList } from "../components/following-list";
import { ProfileSection } from "../components/profile-section";
import { PROFILE_COPY } from "../constant/profile.constant";

export const metadata: Metadata = { title: "Following — kuzu" };

export default function FollowingPage() {
  return (
    <ProfileSection
      id="following"
      title={PROFILE_COPY.followingTitle}
      description={PROFILE_COPY.followingDescription}
    >
      <FollowingList />
    </ProfileSection>
  );
}
