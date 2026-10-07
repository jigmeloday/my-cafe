"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { validateImage } from "@/lib/files";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  label: string;
  hint?: string;
  /** Tailwind classes that set the preview shape, e.g. "aspect-[16/5]" or "size-24 rounded-full". */
  previewClassName: string;
}

export function ImageUpload({
  label,
  hint,
  previewClassName,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const choose = (file?: File) => {
    if (!file) return;
    const problem = validateImage(file);
    setError(problem);
    if (!problem) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex flex-wrap items-center gap-4">
        <div
          className={cn(
            "grid shrink-0 place-items-center overflow-hidden border border-dashed bg-muted/50 text-muted-foreground",
            previewClassName,
          )}
        >
          {preview ? (
            // Local blob preview: next/image can't optimise it.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt={`${label} preview`}
              className="size-full object-cover"
            />
          ) : (
            <ImagePlus className="size-6" />
          )}
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              {preview ? "Replace" : "Upload"}
            </Button>
            {preview && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPreview(null)}
              >
                <X /> Remove
              </Button>
            )}
          </div>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label={label}
        onChange={(e) => {
          choose(e.target.files?.[0]);
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
