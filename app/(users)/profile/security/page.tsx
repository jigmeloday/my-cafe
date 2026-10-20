import type { Metadata } from "next";
import { requireRole } from "@/lib/session";

import { ProfileSection } from "../components/profile-section";
import { ChangePasswordForm } from "../components/change-password-form";
import { DeleteAccount } from "../components/delete-account";
import { PROFILE_COPY } from "../constant/profile.constant";

export const metadata: Metadata = { title: "Security — Nook" };

export default async function SecurityPage() {
  // The layout checks this too, but a page must not rely on that.
  await requireRole("USER", "ADMIN");
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
