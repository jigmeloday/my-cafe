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
  // What is saved right now. Updated after a successful save so the button turns off again.
  const [saved, setSaved] = useState<string[]>(initial);
  const changed = selected.length !== saved.length || selected.some((name) => !saved.includes(name));

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
      <Button
        disabled={pending || !changed}
        onClick={() => {
          const submitted = selected;
          run({ interests: submitted as InterestsInput["interests"] }, () => setSaved(submitted));
        }}
      >
        {pending ? "Saving…" : "Save interests"}
      </Button>
    </div>
  );
}
