"use client";

import { useState } from "react";

import { Chip } from "@/components/shared/chip";

import { INTERESTS } from "../constant/profile-options.constant";
import { SELECTED_INTERESTS } from "../constant/profile.data";

export function InterestsPicker() {
  const [selected, setSelected] = useState<string[]>(SELECTED_INTERESTS);

  const toggle = (name: string) =>
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );

  return (
    <div className="flex flex-wrap gap-2">
      {INTERESTS.map((name) => (
        <Chip
          key={name}
          active={selected.includes(name)}
          onClick={() => toggle(name)}
        >
          {name}
        </Chip>
      ))}
    </div>
  );
}
