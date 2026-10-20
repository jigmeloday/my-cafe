import type { Metadata } from "next";

import { getCurrentProfile } from "@/services/profile/current-profile";

import { ProfileSection } from "../components/profile-section";
import { PersonalInfoForm } from "../components/personal-info-form";
import { PROFILE_COPY } from "../constant/profile.constant";

export const metadata: Metadata = { title: "Personal info — Nook" };

export default async function PersonalinfoPage() {
  const profile = await getCurrentProfile();

  return (
    <ProfileSection
      id="personal"
      title={PROFILE_COPY.personalTitle}
      description={PROFILE_COPY.personalDescription}
    >
      <PersonalInfoForm user={profile} />
    </ProfileSection>
  );
}
