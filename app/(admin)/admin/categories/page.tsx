import type { Metadata } from "next";

import { requireRole } from "@/lib/session";
import { categoryService } from "@/services/category/category.service";

import { CategoryManager } from "./components/category-manager";
import { CATEGORIES_COPY } from "./constant/category.constant";

export const metadata: Metadata = { title: "Categories — Nook admin" };

export default async function AdminCategoriesPage() {
  await requireRole("ADMIN");
  const items = await categoryService.listWithCounts();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1>{CATEGORIES_COPY.title}</h1>
        <p className="text-sm text-muted-foreground">{CATEGORIES_COPY.subtitle}</p>
      </header>
      <CategoryManager items={items} />
    </div>
  );
}
