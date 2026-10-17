"use client";

import type { ChangeEvent } from "react";
import type { DropdownProps } from "react-day-picker";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Month and year menus for the calendar, built with the shadcn Select instead of the browser's
 * plain list. Pass it to <Calendar components={{ Dropdown: CalendarDropdown }} />.
 */
export function CalendarDropdown({ options = [], value, onChange, disabled, "aria-label": label }: DropdownProps) {
  const items = options.map((option) => ({ value: String(option.value), label: option.label }));

  return (
    <Select
      items={items}
      value={String(value)}
      disabled={disabled}
      onValueChange={(next) => {
        // react-day-picker reads `event.target.value`, so hand it an event-shaped object.
        if (next !== null) onChange?.({ target: { value: next } } as ChangeEvent<HTMLSelectElement>);
      }}
    >
      <SelectTrigger
        size="sm"
        aria-label={label}
        className="w-auto gap-1 py-0 pr-1.5 pl-2.5 text-sm font-medium data-[size=sm]:h-7"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-64">
        {options.map((option) => (
          <SelectItem key={option.value} value={String(option.value)} disabled={option.disabled}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
