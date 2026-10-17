import type { Metadata } from "next";

import { getCurrentProfile } from "@/services/profile/current-profile";

import { ProfileSection } from "../components/profile-section";
import { AddressForm } from "../components/address-form";
import { ContactForm } from "../components/contact-form";
import { PROFILE_COPY } from "../constant/profile.constant";

export const metadata: Metadata = { title: "Contact and address — kuzu" };

export default async function ContactandaddressPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="divide-y [&>section]:py-8 [&>section:first-child]:pt-0 [&>section:last-child]:pb-0">
      <ProfileSection
        id="contact"
        title={PROFILE_COPY.contactTitle}
        description={PROFILE_COPY.contactDescription}
      >
        <ContactForm user={profile} />
      </ProfileSection>
      <ProfileSection
        id="address"
        title={PROFILE_COPY.addressTitle}
        description={PROFILE_COPY.addressDescription}
      >
        <AddressForm user={profile} />
      </ProfileSection>
    </div>
  );
}
