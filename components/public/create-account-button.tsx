"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

/** Only shown to visitors who aren't signed in. */
export function CreateAccountButton({ signedIn }: { signedIn: boolean }) {
  const { data } = authClient.useSession();
  if (signedIn || data?.user) return null;

  return (
    <Button render={<Link href="/register" />} size="sm" className="hidden sm:inline-flex">
      Create account
    </Button>
  );
}
