"use client";

import Link from "next/link";
import { useState } from "react";

import { FormMessage } from "@/components/shared/form-message";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/formatters/date";
import { formatNumber } from "@/lib/formatters/number";
import type { ActionResult } from "@/server/actions/action.type";

import { BUSINESS_STATUS, VERIFICATION_LABEL } from "../constant/business.constant";
import type { AdminBusiness } from "../model/business.type";
import { BusinessRowActions } from "./business-row-actions";

const HEADERS = ["Business", "Area", "Live promotions", "Followers", "Verification", "Joined", "Status", ""];

export function BusinessesTable({ items }: { items: AdminBusiness[] }) {
  const [notice, setNotice] = useState<ActionResult | null>(null);

  return (
    <div className="space-y-3">
      {notice && <FormMessage tone={notice.ok ? "success" : "error"}>{notice.ok ? (notice.message ?? "Done.") : notice.error}</FormMessage>}
      <div className="overflow-x-auto rounded-xl border bg-surface">
        <table className="w-full min-w-[60rem] text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr className="border-b">
              {HEADERS.map((h, i) => (
                <th key={h || i} className={`px-4 py-3 font-medium ${i === 2 || i === 3 ? "text-right" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y tabular-nums">
            {items.map((b) => {
              const status = BUSINESS_STATUS[b.status];
              const verification = VERIFICATION_LABEL[b.verification];
              return (
                <tr key={b.id}>
                  <td className="px-4 py-3">
                    {b.status === "SUSPENDED" ? (
                      <span className="block font-medium">{b.name}</span>
                    ) : (
                      <Link href={`/businesses/${b.slug}`} className="block font-medium hover:underline">
                        {b.name}
                      </Link>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {b.ownerName} · {b.ownerEmail}
                    </p>
                  </td>
                  <td className="px-4 py-3">{[b.town, b.dzongkhag].filter(Boolean).join(", ") || "—"}</td>
                  <td className="px-4 py-3 text-right">{formatNumber(b.livePromotions)}</td>
                  <td className="px-4 py-3 text-right">{formatNumber(b.followers)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={verification.tone}>{verification.label}</StatusBadge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{formatDate(b.joined)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <BusinessRowActions item={b} onResult={setNotice} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
