"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { BusinessHoursInput } from "@/lib/validations/business.schema";

interface HoursRowProps {
  form: UseFormReturn<BusinessHoursInput>;
  index: number;
  day: string;
}

export function HoursRow({ form, index, day }: HoursRowProps) {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = form;
  const closed = watch(`hours.${index}.closed`);
  const error = errors.hours?.[index]?.close?.message;

  return (
    <li className="space-y-1 py-3">
      <div className="grid grid-cols-[6.5rem_auto_1fr] items-center gap-x-3 gap-y-2 sm:grid-cols-[8rem_auto_1fr_1fr]">
        <span className="text-sm font-medium">{day}</span>
        <Controller
          control={control}
          name={`hours.${index}.closed`}
          render={({ field }) => (
            <Switch
              checked={!field.value}
              onCheckedChange={(open) => field.onChange(!open)}
              aria-label={`${day} open`}
            />
          )}
        />
        {closed ? (
          <span className="text-sm text-muted-foreground sm:col-span-2">
            Closed
          </span>
        ) : (
          <div className="col-span-3 grid grid-cols-2 gap-2 sm:col-span-2">
            <Input
              type="time"
              aria-label={`${day} opens`}
              aria-invalid={!!error}
              {...register(`hours.${index}.open`)}
            />
            <Input
              type="time"
              aria-label={`${day} closes`}
              aria-invalid={!!error}
              {...register(`hours.${index}.close`)}
            />
          </div>
        )}
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </li>
  );
}
