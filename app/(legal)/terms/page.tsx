import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";

import { LegalPage } from "@/components/legal/legal-page";

import { TERMS } from "../constant/terms.constant";

export const metadata: Metadata = pageMetadata({ title: "Terms and Conditions", description: "The rules for using Nook, for customers and businesses.", path: "/terms" });

export default function TermsPage() {
  return <LegalPage document={TERMS} other={{ label: "Privacy Policy", href: "/privacy" }} />;
}
