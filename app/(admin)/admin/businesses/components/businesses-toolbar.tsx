"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { FilterChips } from "@/components/shared/filter-chips";
import { SearchInput } from "@/components/shared/search-input";
import { useLiveSearch } from "@/hooks/use-live-search";
import type { BusinessFilter, BusinessListQuery } from "@/types/admin-business";

import { BUSINESSES_COPY, FILTERS, SEARCH_DELAY_MS } from "../constant/business.constant";
import { businessesHref } from "../utils/business-url.utils";

interface BusinessesToolbarProps {
  query: Pick<BusinessListQuery, "q" | "filter">;
  counts: Record<BusinessFilter, number>;
}

/** Results update shortly after you stop typing, and Enter searches straight away. Changing the group applies at once. */
export function BusinessesToolbar({ query, counts }: BusinessesToolbarProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { text, setText, submit, commit } = useLiveSearch({
    applied: query.q,
    delay: SEARCH_DELAY_MS,
    onSearch: (q, source) =>
      startTransition(() => {
        const href = businessesHref({ q, filter: query.filter });
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
          aria-label={BUSINESSES_COPY.searchPlaceholder}
          placeholder={BUSINESSES_COPY.searchPlaceholder}
          maxLength={100}
        />
        <p className="mt-1.5 h-4 text-xs text-muted-foreground" aria-live="polite">
          {pending ? "Searching…" : BUSINESSES_COPY.searchHint}
        </p>
      </form>
      <FilterChips
        options={FILTERS.map(({ id, label }) => ({ id, label: `${label} ${counts[id]}` }))}
        active={query.filter}
        onChange={(filter) => {
          const q = commit();
          startTransition(() => router.push(businessesHref({ q, filter: filter as BusinessFilter })));
        }}
      />
    </div>
  );
}
