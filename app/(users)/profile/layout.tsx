import { Container } from "@/components/shared/container";

import { ProfileHeader } from "./components/profile-header";
import { ProfileNav } from "./components/profile-nav";
import { getCurrentProfile } from "@/services/profile/current-profile";

import { buildProfileStats } from "./constant/profile.constant";
import { getEngagement } from "./utils/engagement.server";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  const engagement = await getEngagement();

  return (
    <Container className="max-w-6xl space-y-6 py-6 sm:py-8">
      <ProfileHeader user={profile} stats={buildProfileStats(engagement?.favorites.length ?? 0, engagement?.following.length ?? 0)} />
      <div className="grid gap-8 md:grid-cols-[12rem_1fr] md:gap-10">
        <aside className="md:sticky md:top-24 md:self-start">
          <ProfileNav />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
