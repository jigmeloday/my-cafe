"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Brand } from "@/components/public/brand";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

import { NOT_FOUND_AREAS, type NotFoundArea } from "./constant/not-found.constant";
import { SERVER_ERROR_COPY } from "./constant/server-error.constant";
import { StatusMark } from "./status-mark";

interface ServerErrorViewProps {
  error: Error & { digest?: string };
  /** Tries the page again (re-fetches and re-renders it). */
  retry: () => void;
  /** Where "go back" leads: the public site, the business dashboard or the admin area. */
  area?: NotFoundArea;
  /** Adds a small logo bar on top, for when the usual site header isn't there (an error in the layout itself). */
  standalone?: boolean;
}

/** The page shown when something breaks on our side (a 500). Offers a retry and a way out, and a reference to quote. */
export function ServerErrorView({ error, retry, area = "site", standalone }: ServerErrorViewProps) {
  const { home, homeLabel } = NOT_FOUND_AREAS[area];

  // So it is visible in the browser's console and in any error tool added later.
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      {standalone && (
        <header className="border-b bg-surface">
          <Container className="py-3">
            <Brand />
          </Container>
        </header>
      )}
      <Container className="max-w-3xl space-y-10 py-12 text-center sm:py-20">
        <StatusMark before="5" after="0" />
        <div className="mx-auto max-w-xl space-y-3">
          <h1>{SERVER_ERROR_COPY.title}</h1>
          <p className="text-lg text-muted-foreground">{SERVER_ERROR_COPY.text}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={() => retry()}>
            {SERVER_ERROR_COPY.retry}
          </Button>
          <Button size="lg" variant="secondary" nativeButton={false} render={<Link href={home} />}>
            {homeLabel}
          </Button>
          <Button size="lg" variant="ghost" nativeButton={false} render={<Link href="/contact" />}>
            {SERVER_ERROR_COPY.contact}
          </Button>
        </div>
        {error.digest && (
          <p className="text-sm text-muted-foreground">
            {SERVER_ERROR_COPY.reference}: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{error.digest}</code>. {SERVER_ERROR_COPY.referenceHint}
          </p>
        )}
      </Container>
    </>
  );
}
