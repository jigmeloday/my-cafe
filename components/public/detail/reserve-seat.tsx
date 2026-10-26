"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleCheck, Users } from "lucide-react";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { FormMessage } from "@/components/shared/form-message";
import { PhoneField } from "@/components/shared/phone-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAction } from "@/hooks/use-action";
import { useActionForm } from "@/hooks/use-action-form";
import { registrationSchema } from "@/lib/validations/registration.schema";
import { cancelRegistrationAction, registerForEventAction } from "@/server/actions/registration.actions";
import type { SeatStatus } from "@/services/registration/registration.service";

import { RESERVATION_COPY as COPY } from "../constant/reservation.constant";

interface ReserveSeatProps {
  promotionId: string;
  status: SeatStatus;
  signedIn: boolean;
  /** Only customer accounts can reserve; owners and admins can't. */
  canRegister: boolean;
  loginHref: string;
  defaultName: string;
  defaultPhone: string;
}

/** The "Reserve my seat" button on an event, and what replaces it once the person has a seat. */
export function ReserveSeat({ promotionId, status, signedIn, canRegister, loginHref, defaultName, defaultPhone }: ReserveSeatProps) {
  const [open, setOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const cancel = useAction(cancelRegistrationAction);

  const { form, submit, result, pending } = useActionForm(
    registrationSchema,
    async (values) => {
      const outcome = await registerForEventAction(values);
      if (outcome.ok) setOpen(false);
      return outcome;
    },
    { promotionId, name: defaultName, phone: defaultPhone, agree: false },
  );
  const { register, control, setValue, watch, formState: { errors } } = form;

  const seats = status.seatsLeft === null ? COPY.plenty : status.full ? COPY.full : COPY.seatsLeft(status.seatsLeft);

  if (status.mine) {
    return (
      <div className="space-y-2 rounded-xl bg-success/10 p-3 text-sm">
        <p className="flex items-center gap-2 font-semibold text-success">
          <CircleCheck className="size-4" /> {COPY.mine}
        </p>
        <p className="text-muted-foreground">{COPY.mineHint}</p>
        <Button variant="ghost" size="sm" disabled={cancel.pending} onClick={() => setCancelling(true)}>
          {COPY.cancel}
        </Button>
        {cancel.result && !cancel.result.ok && <p role="alert" className="text-destructive">{cancel.result.error}</p>}
        <ConfirmDialog
          open={cancelling}
          onOpenChange={setCancelling}
          title={COPY.cancelTitle}
          description={COPY.cancelBody}
          confirmLabel={COPY.cancelConfirm}
          cancelLabel={COPY.keep}
          onConfirm={() => cancel.run(promotionId)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {!signedIn ? (
        <Button size="lg" className="w-full" nativeButton={false} render={<Link href={loginHref} />}>
          {COPY.signIn}
        </Button>
      ) : !canRegister ? (
        <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">{COPY.onlyCustomers}</p>
      ) : (
        <Button size="lg" className="w-full" disabled={status.full} onClick={() => setOpen(true)}>
          {status.full ? COPY.full : status.label}
        </Button>
      )}
      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Users className="size-3.5" /> {seats}
      </p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{COPY.dialogTitle}</DialogTitle>
            <DialogDescription>{COPY.dialogText}</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} noValidate className="space-y-4">
            {result && !result.ok && <FormMessage tone="error">{result.error}</FormMessage>}
            <Input label={COPY.nameLabel} error={errors.name?.message} autoComplete="name" {...register("name")} />
            <PhoneField control={control} name="phone" label={COPY.phoneLabel} hint={COPY.phoneHint} error={errors.phone?.message} />
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <Checkbox checked={watch("agree")} onCheckedChange={(v) => setValue("agree", v === true, { shouldValidate: true })} aria-invalid={!!errors.agree} />
              <span>{COPY.agree}</span>
            </label>
            {errors.agree?.message && <p role="alert" className="text-sm text-destructive">{errors.agree.message}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={pending}>
              {pending ? COPY.working : COPY.confirm}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
