"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  id?: string;
  placeholder?: string;
  max?: number;
}

export function TagInput({
  value,
  onChange,
  id,
  placeholder,
  max = 20,
}: TagInputProps) {
  const [draft, setDraft] = useState("");
  const full = value.length >= max;

  const add = () => {
    const tag = draft.trim();
    if (
      !tag ||
      full ||
      value.some((v) => v.toLowerCase() === tag.toLowerCase())
    )
      return;
    onChange([...value, tag]);
    setDraft("");
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          id={id}
          value={draft}
          placeholder={placeholder}
          disabled={full}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={add}
          disabled={full || !draft.trim()}
        >
          <Plus /> Add
        </Button>
      </div>
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <li
              key={tag}
              className="flex items-center gap-1 rounded-full border py-1 pr-1 pl-3 text-sm"
            >
              {tag}
              <button
                type="button"
                aria-label={`Remove ${tag}`}
                onClick={() => onChange(value.filter((v) => v !== tag))}
                className="grid size-5 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
