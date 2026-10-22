"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { authClient } from "@/lib/auth-client";

/**
 * Signing in or out happens on the server, so the browser's copy of "who is signed in" doesn't hear about it.
 * Checking again whenever the person moves to another page keeps the header and hearts right without a reload.
 */
export function SessionSync() {
  const pathname = usePathname();
  const { refetch } = authClient.useSession();
  const first = useRef(true);

  useEffect(() => {
    // The first load already fetched it.
    if (first.current) {
      first.current = false;
      return;
    }
    void refetch();
  }, [pathname, refetch]);

  return null;
}
