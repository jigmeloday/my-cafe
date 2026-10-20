import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

import { LegalPage } from "@/components/legal/legal-page";

import { PRIVACY } from "../constant/privacy.constant";

export const metadata: Metadata = pageMetadata({ title: "Privacy Policy", description: "What information Nook keeps, why, who can see it, and your choices.", path: "/privacy" });

export default function PrivacyPage() {
  return <LegalPage document={PRIVACY} other={{ label: "Terms and Conditions", href: "/terms" }} />;
}
