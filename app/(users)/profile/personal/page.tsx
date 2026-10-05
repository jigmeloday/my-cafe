import type { Metadata } from "next";

import { ProfileSection } from "../components/profile-section";
import { PersonalInfoForm } from "../components/personal-info-form";
import { PROFILE_COPY, PROFILE_USER } from "../constant/profile.constant";

export const metadata: Metadata = { title: "Personal info — kuzu" };

export default function PersonalinfoPage() {
  return (
    <ProfileSection
      id="personal"
      title={PROFILE_COPY.personalTitle}
      description={PROFILE_COPY.personalDescription}
    >
      <PersonalInfoForm user={PROFILE_USER} />
    </ProfileSection>
  );
}
