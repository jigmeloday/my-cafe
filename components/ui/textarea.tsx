import * as React from "react";
import { cn } from "cn";

import { Field } from "@/components/shared/field";
import type { FieldText } from "@/components/ui/input";

function TextareaControl({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-lg border border-foreground/25 bg-surface px-4 py-3 hover:border-foreground text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:ring-1 focus-visible:ring-foreground disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

function Textarea({ label, error, hint, id, ...props }: React.ComponentProps<"textarea"> & FieldText) {
  const autoId = React.useId();
  const textareaId = id ?? autoId;
  const control = <TextareaControl id={textareaId} aria-invalid={!!error || props["aria-invalid"]} {...props} />;
  if (!label) return control;
  return (
    <Field label={label} htmlFor={textareaId} error={error} hint={hint}>
      {control}
    </Field>
  );
}

export { Textarea, TextareaControl };
