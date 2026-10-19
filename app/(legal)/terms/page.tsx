import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";

import { TERMS } from "../constant/terms.constant";

export const metadata: Metadata = {
  title: "Terms and Conditions — kuzu",
  description: "The rules for using kuzu, for customers and businesses.",
};

export default function TermsPage() {
  return <LegalPage document={TERMS} other={{ label: "Privacy Policy", href: "/privacy" }} />;
}
