import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { pageMetadata } from "@/lib/seo/metadata";
import { discoveryService } from "@/services/discovery/discovery.service";

export const metadata: Metadata = pageMetadata({ title: "Browse by category", description: "Find deals, events and places in Bhutan by what they're about: food, music, culture, shopping and more.", path: "/categories" });
export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await discoveryService.categories();

  return (
    <Container className="space-y-8 py-8 sm:py-10">
      <header className="space-y-2">
        <h1>Browse by category</h1>
        <p className="max-w-xl text-muted-foreground">Pick what you are in the mood for.</p>
      </header>
      {categories.length === 0 ? (
        <EmptyState title="No categories yet" description="Categories appear here once businesses publish promotions." />
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/categories/${c.slug}`} className="block space-y-1 rounded-2xl border bg-surface p-5 transition-colors hover:border-foreground">
                <span className="font-semibold">{c.name}</span>
                <span className="block text-sm text-muted-foreground">
                  {c.count} {c.count === 1 ? "offer" : "offers"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
