"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { validateImage } from "@/lib/files";
import { adviseOnShape } from "@/lib/image-shape";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  label: string;
  hint?: string;
  /** Tailwind classes that set the preview shape, e.g. "aspect-[16/5]" or "size-24 rounded-full". */
  previewClassName: string;
  /** A saved image to start with. */
  value?: string | null;
  /** When given, the chosen file is sent here and the preview shows the saved image. Resolve with its URL; throw to show a message. */
  onUpload?: (file: File) => Promise<string>;
  onRemove?: () => Promise<void>;
  /** Called with the chosen file (or null when removed). With no `onUpload`, nothing is sent: the form sends it on save. */
  onChoose?: (file: File | null) => void;
  /** The width ÷ height this picture is meant to have. A picture far from it gets `ratioNote` as advice (not an error). */
  idealRatio?: number;
  ratioNote?: string;
}

export function ImageUpload({
  label,
  hint,
  previewClassName,
  value = null,
  onUpload,
  onRemove,
  onChoose,
  idealRatio,
  ratioNote,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);

  useEffect(
    () => () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const choose = async (file?: File) => {
    if (!file) return;
    const problem = validateImage(file);
    setError(problem);
    setAdvice(null);
    if (problem) return;
    if (idealRatio && ratioNote) void adviseOnShape(file, idealRatio, ratioNote).then(setAdvice);
    if (!onUpload) {
      onChoose?.(file);
      return setPreview(URL.createObjectURL(file));
    }

    setBusy(true);
    try {
      setPreview(await onUpload(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "The upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const clear = async () => {
    if (!onRemove) {
      onChoose?.(null);
      return setPreview(null);
    }
    setBusy(true);
    try {
      await onRemove();
      setPreview(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "We couldn't remove that image.");
    } finally {
      setBusy(false);
    }
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
            // A local preview or a stored image: next/image can't optimise either.
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
              disabled={busy}
            >
              {busy ? "Uploading…" : preview ? "Replace" : "Upload"}
            </Button>
            {preview && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clear}
                disabled={busy}
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
      {!error && advice && <p className="text-sm text-muted-foreground">{advice}</p>}
    </div>
  );
}
