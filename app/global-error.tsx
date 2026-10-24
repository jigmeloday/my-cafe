"use client";

import "./globals.css";

import { ServerErrorView } from "@/components/public/server-error-view";

/** The last resort: shown when even the page frame (the root layout) breaks, so it brings its own <html> and <body>. */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <title>Something went wrong — Nook</title>
        <ServerErrorView error={error} retry={retry} standalone />
      </body>
    </html>
  );
}
