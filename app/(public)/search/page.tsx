import type { Metadata } from "next";
import Link from "next/link";

import { PromotionCard } from "@/components/public/promotion-card";
import { PLACE_GRID, PROMOTION_GRID } from "@/components/public/constant/promotion.constant";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo/metadata";
import { parseWhen, WHEN_OPTIONS } from "@/lib/search-when";
import { searchService } from "@/services/search/search.service";

export const metadata: Metadata = pageMetadata({ title: "Search", path: "/search", noindex: true });
// Results depend on what was typed and on today's date.
export const dynamic = "force-dynamic";

const first = (v: string | string[] | undefined) => ((Array.isArray(v) ? v[0] : v) ?? "").trim().slice(0, 100);

const GROUPS = [
  { key: "deals", title: "Deals and offers" },
  { key: "events", title: "Events" },
  { key: "places", title: "Places" },
] as const;

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const params = await searchParams;
  const what = first(params.what ?? params.q);
  const where = first(params.where);
  const when = parseWhen(params.when);
  const searching = !!(what || where || when);

  const results = await searchService.search({ what, where, when });
  const whenLabel = WHEN_OPTIONS.find((o) => o.id === when)?.label;
  const summary = [what && `“${what}”`, where && `in ${where}`, when && whenLabel?.toLowerCase()].filter(Boolean).join(" ");

  return (
    <Container className="space-y-10 py-8 sm:py-10">
      <header className="space-y-2">
        <h1>{searching ? "Search results" : "Search Nook"}</h1>
        <p className="max-w-2xl text-muted-foreground">
          {searching
            ? results.total > 0
              ? `${results.total} ${results.total === 1 ? "result" : "results"} for ${summary}.`
              : `Nothing found for ${summary}.`
            : "Use the search bar above to look for deals, events and places. Everything is shown below until you do."}
        </p>
      </header>

      {results.total === 0 ? (
        <EmptyState
          title="No matches"
          description="Try fewer or different words, another place, or any time."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="secondary" nativeButton={false} render={<Link href="/deals" />}>Browse deals</Button>
              <Button variant="secondary" nativeButton={false} render={<Link href="/events" />}>Browse events</Button>
              <Button variant="secondary" nativeButton={false} render={<Link href="/discover" />}>New places</Button>
            </div>
          }
        />
      ) : (
        GROUPS.map(({ key, title }) =>
          results[key].length > 0 ? (
            <section key={key} aria-labelledby={`group-${key}`} className="space-y-4">
              <h2 id={`group-${key}`}>
                {title} <span className="text-base font-normal text-muted-foreground">{results[key].length}</span>
              </h2>
              <ul className={results[key][0]?.wide ? PLACE_GRID : PROMOTION_GRID}>
                {results[key].map((item) => (
                  <li key={item.id}>
                    <PromotionCard item={item} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null,
        )
      )}
    </Container>
  );
}
