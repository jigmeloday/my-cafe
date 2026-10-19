"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionRunner } from "@/hooks/use-action-runner";
import type { ActionResult } from "@/server/actions/action.type";
import { deleteCategoryAction, renameCategoryAction } from "@/server/actions/category.actions";
import type { CategoryRow } from "@/services/category/category.service";

import { CATEGORIES_COPY } from "../constant/category.constant";

interface CategoryItemProps {
  item: CategoryRow;
  onResult: (result: ActionResult) => void;
}

export function CategoryItem({ item, onResult }: CategoryItemProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { run, pending } = useActionRunner((result) => {
    onResult(result);
    if (result.ok) setEditing(false);
  });

  const used = item.promotions;
  const warning = used > 0 ? `${used} ${used === 1 ? "promotion uses" : "promotions use"} it and will be left without a category.` : "No promotions use it.";

  return (
    <li className="flex flex-wrap items-center gap-3 px-4 py-3">
      {editing ? (
        <form
          className="flex flex-1 items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            run(renameCategoryAction, item.id, { name });
          }}
        >
          <Input aria-label={`New name for ${item.name}`} value={name} maxLength={30} onChange={(e) => setName(e.target.value)} className="h-10 max-w-xs" />
          <Button type="submit" size="sm" disabled={pending || name.trim() === item.name}>
            {CATEGORIES_COPY.save}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => { setEditing(false); setName(item.name); }}>
            {CATEGORIES_COPY.cancel}
          </Button>
        </form>
      ) : (
        <>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">{used} {used === 1 ? "promotion" : "promotions"}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            {CATEGORIES_COPY.rename}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(true)}>
            {CATEGORIES_COPY.delete}
          </Button>
        </>
      )}
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`Delete “${item.name}”?`}
        description={warning}
        confirmLabel="Delete"
        onConfirm={() => run(deleteCategoryAction, item.id)}
      />
    </li>
  );
}
