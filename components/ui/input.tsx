import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "cn";

import { Field } from "@/components/shared/field";

/** The text the field shows around the box. Pass `label` and the field is wrapped for you. */
export interface FieldText {
  label?: string;
  error?: string;
  hint?: string;
}

/** The bare box, with no label around it. */
function InputControl({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-lg border border-foreground/25 bg-surface px-4 py-2 hover:border-foreground text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:ring-1 focus-visible:ring-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

function Input({ label, error, hint, id, ...props }: React.ComponentProps<"input"> & FieldText) {
  const autoId = React.useId();
  const inputId = id ?? autoId;
  const control = <InputControl id={inputId} aria-invalid={!!error || props["aria-invalid"]} {...props} />;
  if (!label) return control;
  return (
    <Field label={label} htmlFor={inputId} error={error} hint={hint}>
      {control}
    </Field>
  );
}

export { Input, InputControl };
