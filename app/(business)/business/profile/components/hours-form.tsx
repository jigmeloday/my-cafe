"use client";

import { Button } from "@/components/ui/button";
import { ActionForm } from "@/components/shared/action-form";
import { useActionForm } from "@/hooks/use-action-form";
import { businessHoursSchema } from "@/lib/validations/business.schema";
import { updateBusinessHoursAction } from "@/server/actions/business.actions";

import { BUSINESS_PROFILE } from "../constant/profile.data";
import { HoursRow } from "./hours-row";

export function HoursForm() {
  const { form, submit, result, pending } = useActionForm(
    businessHoursSchema,
    updateBusinessHoursAction,
    BUSINESS_PROFILE.hours,
  );
  const days = BUSINESS_PROFILE.hours.hours;

  const copyMondayToAll = () => {
    const monday = form.getValues("hours.0");
    days.forEach((_, i) => {
      if (i > 0) form.setValue(`hours.${i}`, { ...monday, day: days[i].day });
    });
  };

  return (
    <ActionForm
      onSubmit={submit}
      result={result}
      pending={pending}
      submitLabel="Save hours"
    >
      <ul className="divide-y border-y">
        {days.map(({ day }, index) => (
          <HoursRow key={day} form={form} index={index} day={day} />
        ))}
      </ul>
      <Button type="button" variant="ghost" size="sm" onClick={copyMondayToAll}>
        Copy Monday to all days
      </Button>
    </ActionForm>
  );
}
