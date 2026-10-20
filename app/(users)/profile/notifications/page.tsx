import type { Metadata } from "next";
import { requireRole } from "@/lib/session";

import { getEngagement } from "../utils/engagement.server";

import { NotificationList } from "../components/notification-list";
import { ProfileSection } from "../components/profile-section";
import { PROFILE_COPY } from "../constant/profile.constant";

export const metadata: Metadata = { title: "Notifications — Nook" };

export default async function NotificationsPage() {
  // The layout checks this too, but a page must not rely on that.
  await requireRole("USER", "ADMIN");
  const engagement = await getEngagement();
  if (!engagement) return null;

  return (
    <ProfileSection
      id="notifications"
      title={PROFILE_COPY.notificationsTitle}
      description={PROFILE_COPY.notificationsDescription}
    >
      <NotificationList items={engagement.notifications} />
    </ProfileSection>
  );
}
