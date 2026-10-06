"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  buildPhone,
  formatNational,
  parsePhone,
  PHONE_COUNTRIES,
} from "@/lib/phone";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
}

export function PhoneInput({
  value,
  onChange,
  id,
  invalid,
  disabled,
  className,
}: PhoneInputProps) {
  const { country, national } = parsePhone(value);

  const changeCountry = (code: string | null) => {
    const next = PHONE_COUNTRIES.find((c) => c.code === code) ?? country;
    onChange(buildPhone(next, national));
  };

  return (
    <div
      aria-invalid={invalid}
      className={cn(
        "flex h-12 items-center rounded-lg border border-foreground/25 bg-surface transition-colors hover:border-foreground focus-within:border-foreground focus-within:ring-1 focus-within:ring-foreground aria-invalid:border-destructive aria-invalid:focus-within:ring-destructive",
        disabled &&
          "pointer-events-none bg-muted text-muted-foreground hover:border-foreground/25",
        className,
      )}
    >
      <Select
        items={PHONE_COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
        value={country.code}
        onValueChange={changeCountry}
        disabled={disabled}
      >
        <SelectTrigger
          aria-label="Country code"
          className="h-full w-auto shrink-0 gap-1 rounded-r-none border-0 bg-transparent pr-2 pl-4 hover:border-0 focus-visible:ring-0 data-[size=default]:h-full"
        >
          <SelectValue>{() => `${country.flag} ${country.dial}`}</SelectValue>
        </SelectTrigger>
        <SelectContent className="min-w-56">
          {PHONE_COUNTRIES.map((c) => (
            <SelectItem key={c.code} value={c.code}>
              {c.flag} {c.name} ({c.dial})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span aria-hidden className="h-6 w-px shrink-0 bg-border" />
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="17 123 456"
        maxLength={country.maxLength + 2}
        value={formatNational(national)}
        disabled={disabled}
        aria-invalid={invalid}
        onChange={(e) => onChange(buildPhone(country, e.target.value))}
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-muted-foreground md:text-sm"
      />
    </div>
  );
}
