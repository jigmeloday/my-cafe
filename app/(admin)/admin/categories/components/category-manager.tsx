"use client";

import { useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { FormMessage } from "@/components/shared/form-message";
import { useActionForm } from "@/hooks/use-action-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categorySchema } from "@/lib/validations/category.schema";
import { createCategoryAction } from "@/server/actions/category.actions";
import type { ActionResult } from "@/server/actions/action.type";
import type { CategoryRow } from "@/services/category/category.service";

import { CATEGORIES_COPY } from "../constant/category.constant";
import { CategoryItem } from "./category-item";

export function CategoryManager({ items }: { items: CategoryRow[] }) {
  const [notice, setNotice] = useState<ActionResult | null>(null);
  const { form, submit, result, pending } = useActionForm(categorySchema, createCategoryAction, { name: "" }, { clearOnSuccess: true });
  const feedback = notice ?? result;

  return (
    <div className="space-y-4">
      <form onSubmit={submit} noValidate className="flex max-w-lg items-start gap-2">
        <div className="flex-1">
          <Input
            aria-label={CATEGORIES_COPY.addLabel}
            placeholder={CATEGORIES_COPY.addPlaceholder}
            error={form.formState.errors.name?.message}
            maxLength={30}
            {...form.register("name", { onChange: () => setNotice(null) })}
          />
        </div>
        <Button type="submit" size="lg" disabled={pending}>
          {CATEGORIES_COPY.add}
        </Button>
      </form>
      {feedback && <FormMessage tone={feedback.ok ? "success" : "error"}>{feedback.ok ? (feedback.message ?? "Done.") : feedback.error}</FormMessage>}
      {items.length > 0 ? (
        <ul className="divide-y rounded-xl border bg-surface">
          {items.map((item) => (
            <CategoryItem key={item.id} item={item} onResult={setNotice} />
          ))}
        </ul>
      ) : (
        <EmptyState title={CATEGORIES_COPY.emptyTitle} description={CATEGORIES_COPY.emptyDescription} />
      )}
    </div>
  );
}
