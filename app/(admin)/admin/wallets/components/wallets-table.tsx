"use client";

import { useState } from "react";
import { Coins } from "lucide-react";

import { FormMessage } from "@/components/shared/form-message";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/formatters/number";
import type { ActionResult } from "@/server/actions/action.type";
import type { AdminWalletRow } from "@/types/admin-wallet";

import { WALLETS_COPY } from "../constant/wallet.constant";
import { RechargeDialog } from "./recharge-dialog";

export function WalletsTable({ items }: { items: AdminWalletRow[] }) {
  const [target, setTarget] = useState<AdminWalletRow | null>(null);
  const [notice, setNotice] = useState<ActionResult | null>(null);

  return (
    <div className="space-y-3">
      {notice && <FormMessage tone={notice.ok ? "success" : "error"}>{notice.ok ? (notice.message ?? "Done.") : notice.error}</FormMessage>}
      <div className="overflow-x-auto rounded-xl border bg-surface">
        <table className="w-full min-w-[36rem] text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr className="border-b">
              <th className="px-4 py-3 font-medium">Business</th>
              <th className="px-4 py-3 text-right font-medium">Coins</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.businessId}>
                <td className="px-4 py-3">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.ownerEmail}</p>
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  <span className="inline-flex items-center gap-1.5">
                    <Coins className="size-4 text-gold" /> {formatNumber(item.balance)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="secondary" onClick={() => { setNotice(null); setTarget(item); }}>
                    {WALLETS_COPY.add}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <RechargeDialog business={target} onClose={() => setTarget(null)} onResult={setNotice} />
    </div>
  );
}
