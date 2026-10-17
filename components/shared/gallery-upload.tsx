"use client";

import { useRef, useState } from "react";
import { Plus, X } from "lucide-react";

import { validateImage } from "@/lib/files";

interface GalleryUploadProps {
  label: string;
  max?: number;
  /** Saved photos to start with. `id` is whatever `onRemove` needs to delete it. */
  initial?: GalleryItem[];
  /** When given, each chosen file is sent here. Resolve with the saved photo; throw to show a message. */
  onUpload?: (file: File) => Promise<GalleryItem>;
  onRemove?: (id: string) => Promise<void>;
}

export interface GalleryItem {
  id: string;
  url: string;
}

export function GalleryUpload({ label, max = 8, initial = [], onUpload, onRemove }: GalleryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<GalleryItem[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = async (files: FileList | null) => {
    if (!files) return;
    let problem: string | null = null;
    setBusy(true);
    for (const file of Array.from(files).slice(0, max - items.length)) {
      const invalid = validateImage(file);
      if (invalid) {
        problem = invalid;
        continue;
      }
      try {
        const photo = onUpload ? await onUpload(file) : { id: crypto.randomUUID(), url: URL.createObjectURL(file) };
        setItems((prev) => [...prev, photo]);
      } catch (e) {
        problem = e instanceof Error ? e.message : "The upload failed.";
      }
    }
    setError(problem);
    setBusy(false);
  };

  const remove = async (id: string) => {
    try {
      await onRemove?.(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "We couldn't remove that photo.");
    }
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
              disabled={busy}
              className="grid aspect-square w-full place-items-center rounded-xl border border-dashed text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              <span className="flex flex-col items-center gap-1 text-xs font-medium">
                <Plus className="size-5" /> {busy ? "Uploading…" : "Add photos"}
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
