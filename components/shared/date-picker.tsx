"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate, parseIsoDate, toIsoDate } from "@/lib/formatters/date";
import { cn } from "@/lib/utils";

import { CalendarDropdown } from "./calendar-dropdown";

interface DatePickerProps {
  /** "YYYY-MM-DD", or "" when nothing is chosen. */
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  /** Earliest and latest dates that can be chosen, as "YYYY-MM-DD". */
  min?: string;
  max?: string;
  /** Adds month and year dropdowns, handy for far-away dates like birthdays. */
  dropdowns?: boolean;
  /** Shows a Clear button for optional dates. */
  clearable?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
}

const EARLIEST_YEAR = 1900;
const LATEST_YEAR_AHEAD = 10;

export function DatePicker({
  value,
  onChange,
  id,
  placeholder = "Pick a date",
  min,
  max,
  dropdowns,
  clearable,
  invalid,
  disabled,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = parseIsoDate(value);
  const minDate = min ? parseIsoDate(min) : undefined;
  const maxDate = max ? parseIsoDate(max) : undefined;
  const thisYear = new Date().getFullYear();

  const choose = (date: Date | undefined) => {
    onChange(date ? toIsoDate(date) : "");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={invalid}
            className={cn(
              "h-12 w-full justify-between gap-3 border-foreground/25 px-4 font-normal hover:border-foreground",
              !selected && "text-muted-foreground",
              className
            )}
          />
        }
      >
        <span className="truncate">{selected ? formatDate(value) : placeholder}</span>
        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={choose}
          defaultMonth={selected ?? maxDate ?? minDate}
          disabled={[...(minDate ? [{ before: minDate }] : []), ...(maxDate ? [{ after: maxDate }] : [])]}
          captionLayout={dropdowns ? "dropdown" : "label"}
          startMonth={dropdowns ? new Date(EARLIEST_YEAR, 0) : (minDate ?? undefined)}
          endMonth={dropdowns ? new Date((maxDate ?? new Date(thisYear + LATEST_YEAR_AHEAD, 0)).getFullYear(), 11) : (maxDate ?? undefined)}
          components={dropdowns ? { Dropdown: CalendarDropdown } : undefined}
          autoFocus
        />
        {clearable && selected && (
          <div className="border-t p-2">
            <Button type="button" variant="ghost" size="sm" className="w-full" onClick={() => choose(undefined)}>
              Clear date
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
