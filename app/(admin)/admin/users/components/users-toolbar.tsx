"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { FilterChips } from "@/components/shared/filter-chips";
import { SearchInput } from "@/components/shared/search-input";
import { useLiveSearch } from "@/hooks/use-live-search";
import type { UserFilter, UserListQuery } from "@/types/admin-user";

import { FILTERS, SEARCH_DELAY_MS, USERS_COPY } from "../constant/user.constant";
import { usersHref } from "../utils/user-url.utils";

interface UsersToolbarProps {
  query: Pick<UserListQuery, "q" | "filter">;
  counts: Record<UserFilter, number>;
}

/**
 * Results update shortly after you stop typing (one request per pause, not one per key), and Enter
 * searches straight away. Changing the group applies at once. Either way you go back to page 1.
 */
export function UsersToolbar({ query, counts }: UsersToolbarProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { text, setText, submit, commit } = useLiveSearch({
    applied: query.q,
    delay: SEARCH_DELAY_MS,
    onSearch: (q, source) =>
      startTransition(() => {
        const href = usersHref({ q, filter: query.filter });
        // Typing shouldn't fill the Back button with every pause; pressing Enter is deliberate.
        if (source === "typing") router.replace(href);
        else router.push(href);
      }),
  });

  return (
    <div className="space-y-3" aria-busy={pending}>
      <form
        role="search"
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
          aria-label={USERS_COPY.searchPlaceholder}
          placeholder={USERS_COPY.searchPlaceholder}
          maxLength={100}
        />
        <p className="mt-1.5 h-4 text-xs text-muted-foreground" aria-live="polite">
          {pending ? "Searching…" : USERS_COPY.searchHint}
        </p>
      </form>
      <FilterChips
        options={FILTERS.map(({ id, label }) => ({ id, label: `${label} ${counts[id]}` }))}
        active={query.filter}
        onChange={(filter) => {
          const q = commit();
          startTransition(() => router.push(usersHref({ q, filter: filter as UserFilter })));
        }}
      />
    </div>
  );
}
