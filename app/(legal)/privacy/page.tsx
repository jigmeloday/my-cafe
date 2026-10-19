import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";

import { PRIVACY } from "../constant/privacy.constant";

export const metadata: Metadata = {
  title: "Privacy Policy — kuzu",
  description: "What information kuzu keeps, why, who can see it, and your choices.",
};

export default function PrivacyPage() {
  return <LegalPage document={PRIVACY} other={{ label: "Terms and Conditions", href: "/terms" }} />;
}
