"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { SearchInput } from "@/components/shared/search-input";
import { useLiveSearch } from "@/hooks/use-live-search";

import { SEARCH_DELAY_MS, WALLETS_COPY } from "../constant/wallet.constant";
import { walletsHref } from "../utils/wallet-url.utils";

export function WalletsToolbar({ q }: { q: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { text, setText, submit } = useLiveSearch({
    applied: q,
    delay: SEARCH_DELAY_MS,
    onSearch: (query, source) =>
      startTransition(() => {
        const href = walletsHref({ q: query });
        if (source === "typing") router.replace(href);
        else router.push(href);
      }),
  });

  return (
    <form
      role="search"
      aria-busy={pending}
      className="sm:max-w-md"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <SearchInput
        name="q"
        value={text}
        onChange={(event) => setText(event.target.value)}
        aria-label={WALLETS_COPY.searchPlaceholder}
        placeholder={WALLETS_COPY.searchPlaceholder}
        maxLength={100}
      />
      <p className="mt-1.5 h-4 text-xs text-muted-foreground" aria-live="polite">
        {pending ? "Searching…" : WALLETS_COPY.searchHint}
      </p>
    </form>
  );
}
