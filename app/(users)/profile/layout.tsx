import { Container } from "@/components/shared/container";

import { ProfileHeader } from "./components/profile-header";
import { ProfileNav } from "./components/profile-nav";
import { PROFILE_STATS, PROFILE_USER } from "./constant/profile.constant";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container className="max-w-6xl space-y-6 py-6 sm:py-8">
      <ProfileHeader user={PROFILE_USER} stats={PROFILE_STATS} />
      <div className="grid gap-8 md:grid-cols-[12rem_1fr] md:gap-10">
        <aside className="md:sticky md:top-24 md:self-start">
          <ProfileNav />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
