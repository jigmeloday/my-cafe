import Link from "next/link";

import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/formatters/date";
import { formatNumber } from "@/lib/formatters/number";
import type { ActionResult } from "@/server/actions/action.type";

import { BUSINESS_STATUS } from "../constant/business.constant";
import type { AdminBusiness } from "../model/business.type";
import { BusinessRowActions } from "./business-row-actions";

const HEADERS = [
  "Business",
  "Category",
  "Dzongkhag",
  "Promotions",
  "Followers",
  "Joined",
  "Status",
  "",
];

interface BusinessesTableProps {
  items: AdminBusiness[];
  onResult: (result: ActionResult) => void;
}

export function BusinessesTable({ items, onResult }: BusinessesTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-surface">
      <table className="w-full min-w-[56rem] text-sm">
        <thead className="text-left text-xs text-muted-foreground">
          <tr className="border-b">
            {HEADERS.map((h, i) => (
              <th
                key={h || i}
                className={`px-4 py-3 font-medium ${i === 3 || i === 4 ? "text-right" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y tabular-nums">
          {items.map((b) => {
            const { label, tone } = BUSINESS_STATUS[b.status];
            return (
              <tr key={b.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/businesses/${b.slug}`}
                    className="block font-medium hover:underline"
                  >
                    {b.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {b.ownerName} · {b.ownerEmail}
                  </p>
                </td>
                <td className="px-4 py-3">{b.category}</td>
                <td className="px-4 py-3">{b.dzongkhag}</td>
                <td className="px-4 py-3 text-right">
                  {formatNumber(b.promotions)}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatNumber(b.followers)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {formatDate(b.joined)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge tone={tone}>{label}</StatusBadge>
                </td>
                <td className="px-4 py-3 text-right">
                  <BusinessRowActions item={b} onResult={onResult} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
