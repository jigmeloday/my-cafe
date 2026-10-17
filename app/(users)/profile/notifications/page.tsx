import type { Metadata } from "next";

import { getEngagement } from "../utils/engagement.server";

import { NotificationList } from "../components/notification-list";
import { ProfileSection } from "../components/profile-section";
import { PROFILE_COPY } from "../constant/profile.constant";

export const metadata: Metadata = { title: "Notifications — kuzu" };

export default async function NotificationsPage() {
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
