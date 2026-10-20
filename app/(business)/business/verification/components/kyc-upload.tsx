"use client";

import { useRef, useState } from "react";
import { CircleCheck, FileText, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { uploadKycDocument } from "@/lib/upload-client";

interface KycUploadProps {
  kind: "id" | "license" | "premises";
  label: string;
  hint: string;
  required: boolean;
  /** Called with the stored file's key, or "" when it's removed. */
  onChange: (key: string) => void;
  error?: string;
}

/** Uploads one document. The file isn't shown back (it's private): we only confirm it arrived. */
export function KycUpload({ kind, label, hint, required, onChange, error }: KycUploadProps) {
  const input = useRef<HTMLInputElement>(null);
  const [name, setName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const choose = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setProblem(null);
    try {
      onChange(await uploadKycDocument(kind, file));
      setName(file.name);
    } catch (e) {
      setProblem(e instanceof Error ? e.message : "The upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const message = problem ?? error;
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        {label} {!required && <span className="font-normal text-muted-foreground">(optional)</span>}
      </p>
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed p-3">
        {name ? <CircleCheck className="size-5 shrink-0 text-success" /> : <FileText className="size-5 shrink-0 text-muted-foreground" />}
        <div className="min-w-0 flex-1 text-sm">
          {name ? <p className="truncate font-medium">{name}</p> : <p className="text-muted-foreground">{hint}</p>}
          {name && <p className="text-xs text-muted-foreground">Uploaded. Only the Nook review team can open it.</p>}
        </div>
        <Button type="button" variant="secondary" size="sm" disabled={busy} onClick={() => input.current?.click()}>
          <Upload /> {busy ? "Uploading…" : name ? "Replace" : "Choose file"}
        </Button>
        {name && !busy && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setName(null);
              onChange("");
            }}
          >
            Remove
          </Button>
        )}
      </div>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="sr-only"
        aria-label={label}
        onChange={(e) => {
          void choose(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {message && (
        <p role="alert" className="text-sm text-destructive">
          {message}
        </p>
      )}
    </div>
  );
}
