import type { Metadata } from "next";

import { NotFoundView } from "@/components/public/not-found-view";
import { SiteShell } from "@/components/public/site-shell";
import { NO_INDEX } from "@/lib/seo/metadata";

export const metadata: Metadata = { title: "Page not found — Nook", ...NO_INDEX };

export default function NotFound() {
  return (
    <SiteShell>
      <NotFoundView />
    </SiteShell>
  );
}
