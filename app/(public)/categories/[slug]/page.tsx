import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { PromotionCard } from "@/components/public/promotion-card";
import { PROMOTION_GRID } from "@/components/public/constant/promotion.constant";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { discoveryService } from "@/services/discovery/discovery.service";

// New promotions appear as soon as they are published, so this page is built per request.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/categories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = await discoveryService.categoryPage(slug);
  return { title: page ? `${page.name} — kuzu` : "Category not found — kuzu" };
}

const GROUPS = [
  { key: "deals", title: "Deals and offers" },
  { key: "events", title: "Events" },
  { key: "places", title: "Places" },
] as const;

export default async function CategoryPage({ params }: PageProps<"/categories/[slug]">) {
  const { slug } = await params;
  const page = await discoveryService.categoryPage(slug);
  if (!page) notFound();
  const empty = page.deals.length + page.events.length + page.places.length === 0;

  return (
    <Container className="space-y-10 py-8 sm:py-10">
      <header className="space-y-2">
        <Link href="/categories" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" /> All categories
        </Link>
        <h1>{page.name}</h1>
        <p className="text-muted-foreground">Deals, events and places in {page.name}.</p>
      </header>
      {empty ? (
        <EmptyState title={`Nothing in ${page.name} right now`} description="Check back soon, or browse everything." />
      ) : (
        GROUPS.map(({ key, title }) =>
          page[key].length > 0 ? (
            <section key={key} aria-labelledby={`group-${key}`} className="space-y-4">
              <h2 id={`group-${key}`}>
                {title} <span className="text-base font-normal text-muted-foreground">{page[key].length}</span>
              </h2>
              <ul className={PROMOTION_GRID}>
                {page[key].map((item) => (
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
