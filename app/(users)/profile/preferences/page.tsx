import type { Metadata } from "next";

import { ProfileSection } from "../components/profile-section";
import { InterestsPicker } from "../components/interests-picker";
import { PreferencesForm } from "../components/preferences-form";
import { PROFILE_COPY, PROFILE_USER } from "../constant/profile.constant";

export const metadata: Metadata = { title: "Preferences — kuzu" };

export default function PreferencesPage() {
  return (
    <div className="divide-y [&>section]:py-8 [&>section:first-child]:pt-0 [&>section:last-child]:pb-0">
      <ProfileSection
        id="interests"
        title={PROFILE_COPY.interestsTitle}
        description={PROFILE_COPY.interestsDescription}
      >
        <InterestsPicker />
      </ProfileSection>
      <ProfileSection
        id="notifications"
        title="Notifications"
        description="Control what we send you and where."
      >
        <PreferencesForm user={PROFILE_USER} />
      </ProfileSection>
    </div>
  );
}
