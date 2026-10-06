import type { UseFormRegisterReturn } from "react-hook-form";

import {
  ACCOUNT_TYPE_OPTIONS,
  REGISTER_COPY,
} from "../constant/register.constant";

export function AccountTypeField({ field }: { field: UseFormRegisterReturn }) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">
        {REGISTER_COPY.accountTypeLabel}
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {ACCOUNT_TYPE_OPTIONS.map(
          ({ value, title, description, icon: Icon }) => (
            <label key={value} className="cursor-pointer">
              <input
                type="radio"
                value={value}
                className="peer sr-only"
                {...field}
              />
              <span className="flex h-full flex-col gap-2 rounded-2xl border p-4 transition-colors hover:border-foreground peer-checked:border-foreground peer-checked:bg-muted/60 peer-checked:ring-1 peer-checked:ring-foreground peer-focus-visible:ring-3 peer-focus-visible:ring-ring/40">
                <Icon className="size-6" />
                <span className="font-semibold">{title}</span>
                <span className="text-sm text-muted-foreground">
                  {description}
                </span>
              </span>
            </label>
          ),
        )}
      </div>
    </fieldset>
  );
}
