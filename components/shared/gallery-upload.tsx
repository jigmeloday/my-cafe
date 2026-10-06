"use client";

import { useRef, useState } from "react";
import { Plus, X } from "lucide-react";

import { validateImage } from "@/lib/files";

interface GalleryUploadProps {
  label: string;
  max?: number;
}

interface GalleryItem {
  id: string;
  url: string;
}

export function GalleryUpload({ label, max = 8 }: GalleryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const add = (files: FileList | null) => {
    if (!files) return;
    const added: GalleryItem[] = [];
    let problem: string | null = null;
    for (const file of Array.from(files).slice(0, max - items.length)) {
      problem = validateImage(file) ?? problem;
      if (!validateImage(file))
        added.push({ id: crypto.randomUUID(), url: URL.createObjectURL(file) });
    }
    setError(problem);
    setItems((prev) => [...prev, ...added]);
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        {label}{" "}
        <span className="font-normal text-muted-foreground">
          ({items.length}/{max})
        </span>
      </p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="relative aspect-square overflow-hidden rounded-xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt="" className="size-full object-cover" />
            <button
              type="button"
              aria-label="Remove photo"
              onClick={() => remove(item.id)}
              className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-surface shadow"
            >
              <X className="size-4" />
            </button>
          </li>
        ))}
        {items.length < max && (
          <li>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="grid aspect-square w-full place-items-center rounded-xl border border-dashed text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              <span className="flex flex-col items-center gap-1 text-xs font-medium">
                <Plus className="size-5" /> Add photos
              </span>
            </button>
          </li>
        )}
      </ul>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        aria-label={label}
        onChange={(e) => {
          add(e.target.files);
          e.target.value = "";
        }}
      />
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
