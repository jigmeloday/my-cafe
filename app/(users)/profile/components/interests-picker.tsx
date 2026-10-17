"use client";

import { useState } from "react";

import { Chip } from "@/components/shared/chip";
import { FormMessage } from "@/components/shared/form-message";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { updateInterestsAction } from "@/server/actions/account.actions";
import type { InterestsInput } from "@/lib/validations/profile.schema";

import { INTERESTS } from "../constant/profile-options.constant";

export function InterestsPicker({ initial }: { initial: string[] }) {
  const [selected, setSelected] = useState<string[]>(initial);
  const { run, result, pending } = useAction(updateInterestsAction);

  const toggle = (name: string) =>
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));

  return (
    <div className="space-y-4">
      {result && (
        <FormMessage tone={result.ok ? "success" : "error"}>
          {result.ok ? (result.message ?? "Saved.") : result.error}
        </FormMessage>
      )}
      <div className="flex flex-wrap gap-2">
        {INTERESTS.map((name) => (
          <Chip key={name} active={selected.includes(name)} onClick={() => toggle(name)}>
            {name}
          </Chip>
        ))}
      </div>
      <Button disabled={pending} onClick={() => run({ interests: selected as InterestsInput["interests"] })}>
        {pending ? "Saving…" : "Save interests"}
      </Button>
    </div>
  );
}
