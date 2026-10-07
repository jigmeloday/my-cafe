import { DEFAULT_CURRENCY } from "@/lib/constants";
import { Input } from "@/components/ui/input";

import { Field } from "./field";

interface MoneyFieldProps extends React.ComponentProps<"input"> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
}

const SYMBOL =
  new Intl.NumberFormat("en", { style: "currency", currency: DEFAULT_CURRENCY })
    .formatToParts(0)
    .find((part) => part.type === "currency")?.value ?? "$";

export function MoneyField({
  id,
  label,
  hint,
  error,
  ...props
}: MoneyFieldProps) {
  return (
    <Field label={label} htmlFor={id} hint={hint} error={error}>
      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-muted-foreground"
        >
          {SYMBOL}
        </span>
        <Input
          id={id}
          inputMode="decimal"
          placeholder="0.00"
          aria-invalid={!!error}
          className="pl-8"
          {...props}
        />
      </div>
    </Field>
  );
}
