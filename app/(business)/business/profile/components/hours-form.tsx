"use client";

import { Button } from "@/components/ui/button";
import { ActionForm } from "@/components/shared/action-form";
import { useActionForm } from "@/hooks/use-action-form";
import { businessHoursSchema } from "@/lib/validations/business.schema";
import { updateBusinessHoursAction } from "@/server/actions/business.actions";

import type { BusinessProfileData } from "@/types/business-profile";
import { HoursRow } from "./hours-row";

export function HoursForm({ data }: { data: BusinessProfileData["hours"] }) {
  const { form, submit, result, pending, dirty } = useActionForm(
    businessHoursSchema,
    updateBusinessHoursAction,
    data,
  );
  const days = data.hours;

  const copyMondayToAll = () => {
    const monday = form.getValues("hours.0");
    days.forEach((_, i) => {
      if (i > 0) form.setValue(`hours.${i}`, { ...monday, day: days[i].day }, { shouldDirty: true });
    });
  };

  return (
    <ActionForm
      onSubmit={submit}
      result={result}
      pending={pending}
      dirty={dirty}
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
