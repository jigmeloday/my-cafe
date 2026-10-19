"use client";

import { useState, useTransition } from "react";

import { FormMessage } from "@/components/shared/form-message";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { rechargeSchema } from "@/lib/validations/recharge.schema";
import type { ActionResult } from "@/server/actions/action.type";
import { rechargeWalletAction } from "@/server/actions/admin-wallet.actions";
import type { AdminWalletRow } from "@/types/admin-wallet";

import { QUICK_AMOUNTS, WALLETS_COPY } from "../constant/wallet.constant";

interface RechargeDialogProps {
  business: AdminWalletRow | null;
  onClose: () => void;
  onResult: (result: ActionResult) => void;
}

export function RechargeDialog({ business, onClose, onResult }: RechargeDialogProps) {
  const [coins, setCoins] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const close = () => {
    setCoins("");
    setNote("");
    setError(null);
    onClose();
  };

  const submit = () => {
    if (!business) return;
    const parsed = rechargeSchema.safeParse({ businessId: business.businessId, coins: /^\d+$/.test(coins) ? Number(coins) : NaN, note });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Please check the form.");
    setError(null);
    startTransition(async () => {
      const result = await rechargeWalletAction(parsed.data);
      if (result.ok) {
        onResult(result);
        close();
      } else setError(result.error);
    });
  };

  return (
    <Dialog open={!!business} onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{WALLETS_COPY.dialogTitle}</DialogTitle>
          <DialogDescription>{business ? `${business.name} · ${business.ownerEmail}` : ""}</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          {error && <FormMessage tone="error">{error}</FormMessage>}
          <Input label={WALLETS_COPY.coinsLabel} inputMode="numeric" value={coins} onChange={(e) => setCoins(e.target.value)} autoFocus />
          <div className="flex gap-2">
            {QUICK_AMOUNTS.map((amount) => (
              <Button key={amount} type="button" variant="secondary" size="sm" onClick={() => setCoins(String(amount))}>
                +{amount}
              </Button>
            ))}
          </div>
          <Input label={WALLETS_COPY.noteLabel} hint={WALLETS_COPY.noteHint} value={note} maxLength={100} onChange={(e) => setNote(e.target.value)} />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Adding…" : WALLETS_COPY.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
