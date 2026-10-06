import type { Metadata } from "next";

import { ProfileHeader } from "./components/profile-header";
import { ProfileTabs } from "./components/profile-tabs";

export const metadata: Metadata = { title: "Business profile — kuzu business" };

export default function BusinessProfilePage() {
  return (
    <div className="space-y-6">
      <ProfileHeader />
      <ProfileTabs />
    </div>
  );
}
