import Link from "next/link";

import type { CategoryLink } from "@/services/discovery/discovery.service";

/** A row of category links, so people can browse by what they're in the mood for. */
export function CategoryChips({ categories }: { categories: CategoryLink[] }) {
  return (
    <nav aria-label="Browse by category" className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/categories/${c.slug}`}
          className="shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:border-foreground"
        >
          {c.name}
        </Link>
      ))}
      <Link href="/categories" className="shrink-0 rounded-full px-4 py-2 text-sm font-medium text-primary hover:underline">
        All categories
      </Link>
    </nav>
  );
}
