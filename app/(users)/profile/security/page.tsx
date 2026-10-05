import type { Metadata } from "next";

import { ProfileSection } from "../components/profile-section";
import { ChangePasswordForm } from "../components/change-password-form";
import { DeleteAccount } from "../components/delete-account";
import { PROFILE_COPY } from "../constant/profile.constant";

export const metadata: Metadata = { title: "Security — kuzu" };

export default function SecurityPage() {
  return (
    <div className="divide-y [&>section]:py-8 [&>section:first-child]:pt-0 [&>section:last-child]:pb-0">
      <ProfileSection
        id="password"
        title={PROFILE_COPY.passwordTitle}
        description={PROFILE_COPY.passwordDescription}
      >
        <ChangePasswordForm />
      </ProfileSection>
      <ProfileSection
        id="danger"
        title={PROFILE_COPY.dangerTitle}
        description={PROFILE_COPY.dangerDescription}
      >
        <DeleteAccount />
      </ProfileSection>
    </div>
  );
}
