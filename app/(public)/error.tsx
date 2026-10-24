"use client";

import { ServerErrorView } from "@/components/public/server-error-view";

/** Shown instead of this area's page when something breaks. The area's own header and menu stay in place. */
export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <ServerErrorView error={error} retry={retry} area="site" />;
}
