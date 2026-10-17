"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Field } from "@/components/shared/field";
import { InputControl, type FieldText } from "@/components/ui/input";

export function PasswordInput({
  label,
  error,
  hint,
  id,
  ...props
}: React.ComponentProps<"input"> & FieldText) {
  const [visible, setVisible] = useState(false);
  const autoId = useId();
  const inputId = id ?? autoId;

  const box = (
    <div className="relative">
      <InputControl
        id={inputId}
        aria-invalid={!!error || props["aria-invalid"]}
        {...props}
        type={visible ? "text" : "password"}
        className="pr-12"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted-foreground hover:text-foreground"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
  if (!label) return box;
  return (
    <Field label={label} htmlFor={inputId} error={error} hint={hint}>
      {box}
    </Field>
  );
}
