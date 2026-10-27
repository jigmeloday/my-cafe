"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleCheck } from "lucide-react";

import { FormMessage } from "@/components/shared/form-message";
import { PhoneField } from "@/components/shared/phone-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useActionForm } from "@/hooks/use-action-form";
import { MAX_ORDER_QUANTITY } from "@/lib/constants";
import { formatMoney } from "@/lib/formatters/currency";
import { orderSchema } from "@/lib/validations/order.schema";
import { placeOrderAction } from "@/server/actions/order.actions";

import { ORDER_COPY as COPY } from "../constant/order.constant";

interface PlaceOrderProps {
  promotionId: string;
  label: string;
  /** The price of one, in minor units, or null when the seller gave none. */
  price: number | null;
  signedIn: boolean;
  /** Only customer accounts can order; owners and admins can't. */
  canOrder: boolean;
  loginHref: string;
  defaultName: string;
  defaultPhone: string;
}

/** The order button on a deal or sale item, and the form it opens. */
export function PlaceOrder({ promotionId, label, price, signedIn, canOrder, loginHref, defaultName, defaultPhone }: PlaceOrderProps) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const { form, submit, result, pending } = useActionForm(
    orderSchema,
    async (values) => {
      const outcome = await placeOrderAction(values);
      if (outcome.ok) setSent(true);
      return outcome;
    },
    { promotionId, name: defaultName, phone: defaultPhone, quantity: 1, note: "", agree: false },
    { clearOnSuccess: true },
  );
  const { register, control, setValue, watch, formState: { errors } } = form;
  const quantity = Number(watch("quantity")) || 0;

  const change = (next: boolean) => {
    setOpen(next);
    if (!next) setSent(false);
  };

  return (
    <div className="space-y-2">
      {!signedIn ? (
        <Button size="lg" className="w-full" nativeButton={false} render={<Link href={loginHref} />}>
          {COPY.signIn}
        </Button>
      ) : !canOrder ? (
        <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">{COPY.onlyCustomers}</p>
      ) : (
        <Button size="lg" className="w-full" onClick={() => setOpen(true)}>
          {label}
        </Button>
      )}
      <p className="text-center text-xs text-muted-foreground">{COPY.paymentNote}</p>
      <Dialog open={open} onOpenChange={change}>
        <DialogContent>
          {sent ? (
            <div className="space-y-4 py-2 text-center">
              <CircleCheck className="mx-auto size-10 text-success" />
              <DialogHeader>
                <DialogTitle className="text-center">{COPY.doneTitle}</DialogTitle>
                <DialogDescription className="text-center">{COPY.doneText}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button nativeButton={false} render={<Link href="/profile/orders" />}>{COPY.viewOrders}</Button>
                <Button variant="ghost" onClick={() => change(false)}>{COPY.close}</Button>
              </div>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{COPY.dialogTitle}</DialogTitle>
                <DialogDescription>{COPY.dialogText}</DialogDescription>
              </DialogHeader>
              <form onSubmit={submit} noValidate className="space-y-4">
                {result && !result.ok && <FormMessage tone="error">{result.error}</FormMessage>}
                <Input label={COPY.nameLabel} error={errors.name?.message} autoComplete="name" {...register("name")} />
                <PhoneField control={control} name="phone" label={COPY.phoneLabel} hint={COPY.phoneHint} error={errors.phone?.message} />
                <Input label={COPY.quantityLabel} error={errors.quantity?.message} type="number" inputMode="numeric" min={1} max={MAX_ORDER_QUANTITY} {...register("quantity", { valueAsNumber: true })} />
                <Textarea label={COPY.noteLabel} hint={COPY.noteHint} error={errors.note?.message} rows={3} maxLength={200} {...register("note")} />
                {price !== null && quantity > 0 && (
                  <p className="flex items-baseline justify-between rounded-xl bg-muted px-4 py-3 text-sm">
                    <span className="text-muted-foreground">{COPY.total}</span>
                    <span className="text-lg font-semibold">{formatMoney(price * quantity)}</span>
                  </p>
                )}
                <label className="flex cursor-pointer items-start gap-3 text-sm">
                  <Checkbox checked={watch("agree")} onCheckedChange={(v) => setValue("agree", v === true, { shouldValidate: true, shouldDirty: true })} aria-invalid={!!errors.agree} />
                  <span>{COPY.agree}</span>
                </label>
                {errors.agree?.message && <p role="alert" className="text-sm text-destructive">{errors.agree.message}</p>}
                <Button type="submit" size="lg" className="w-full" disabled={pending}>
                  {pending ? COPY.working : COPY.confirm}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
