import { randomBytes } from "node:crypto";

import { slugify } from "@/lib/slug";
import { categoryRepository } from "@/server/repositories/category.repository";

type Result = { ok: true; message: string } | { ok: false; error: string };
const DUPLICATE: Result = { ok: false, error: "A category with that name already exists." };

export interface CategoryRow {
  id: string;
  name: string;
  promotions: number;
}

export const categoryService = {
  /** For admin: every category with how many promotions use it. */
  async listWithCounts(): Promise<CategoryRow[]> {
    const rows = await categoryRepository.listWithCounts();
    return rows.map((c) => ({ id: c.id, name: c.name, promotions: c._count.promotions }));
  },

  /** For pickers: the value is the id, so renaming a category never breaks promotions that use it. */
  async options() {
    return (await categoryRepository.list()).map((c) => ({ value: c.id, label: c.name }));
  },

  async create(name: string): Promise<Result> {
    if (await categoryRepository.findByName(name)) return DUPLICATE;
    let slug = slugify(name, "category");
    // The address part must be unique even when two different names look alike ("Café" and "Cafe!").
    if (await categoryRepository.slugTaken(slug)) slug = `${slug}-${randomBytes(2).toString("hex")}`;
    await categoryRepository.create(name, slug);
    return { ok: true, message: "Category added." };
  },

  async rename(id: string, name: string): Promise<Result> {
    const same = await categoryRepository.findByName(name);
    if (same && same.id !== id) return DUPLICATE;
    try {
      await categoryRepository.rename(id, name);
    } catch {
      return { ok: false, error: "We couldn't find that category." };
    }
    return { ok: true, message: "Category renamed." };
  },

  /** Promotions in a deleted category simply end up with no category. */
  async remove(id: string): Promise<Result> {
    return (await categoryRepository.remove(id)) ? { ok: true, message: "Category deleted." } : { ok: false, error: "We couldn't find that category." };
  },
};
