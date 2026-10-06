import type { Metadata } from "next";

import { NotificationList } from "../components/notification-list";
import { ProfileSection } from "../components/profile-section";
import { PROFILE_COPY } from "../constant/profile.constant";

export const metadata: Metadata = { title: "Notifications — kuzu" };

export default function NotificationsPage() {
  return (
    <ProfileSection
      id="notifications"
      title={PROFILE_COPY.notificationsTitle}
      description={PROFILE_COPY.notificationsDescription}
    >
      <NotificationList />
    </ProfileSection>
  );
}
