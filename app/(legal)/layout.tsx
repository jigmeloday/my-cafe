import { SiteShell } from "@/components/public/site-shell";

/**
 * The Terms and Privacy pages are open to everyone, including business owners (who are kept out of the rest of
 * the public site), because they have to be able to read what they agreed to.
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
