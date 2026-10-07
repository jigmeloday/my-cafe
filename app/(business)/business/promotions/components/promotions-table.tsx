import Link from "next/link";

import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatNumber } from "@/lib/formatters/number";
import type { ActionResult } from "@/server/actions/action.type";

import {
  STATUS_LABELS,
  STATUS_TONES,
  TYPE_OPTIONS,
} from "../constant/promotion.constant";
import type { PromotionItem } from "../model/promotion.type";
import { formatDateRange } from "../utils/promotion.utils";
import { RowActions } from "./row-actions";

const HEADERS = ["Promotion", "Status", "Dates", "Clicks", ""];
const typeLabel = (value: string) =>
  TYPE_OPTIONS.find((t) => t.value === value)?.label ?? value;

interface PromotionsTableProps {
  items: PromotionItem[];
  onResult: (result: ActionResult) => void;
}

export function PromotionsTable({ items, onResult }: PromotionsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-surface">
      <table className="w-full min-w-[46rem] text-sm">
        <thead className="text-left text-xs text-muted-foreground">
          <tr className="border-b">
            {HEADERS.map((h, i) => (
              <th
                key={h || i}
                className={`px-4 py-3 font-medium ${i === 3 ? "text-right" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y tabular-nums">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <ImagePlaceholder
                    label=""
                    className="size-11 shrink-0 rounded-lg"
                  />
                  <div className="min-w-0">
                    <Link
                      href={`/business/promotions/${item.id}/edit`}
                      className="block truncate font-medium hover:underline"
                    >
                      {item.values.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {typeLabel(item.values.type)}
                      {item.values.discount && ` · ${item.values.discount}`}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge tone={STATUS_TONES[item.status]}>
                  {STATUS_LABELS[item.status]}
                </StatusBadge>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                {formatDateRange(item.values)}
              </td>
              <td className="px-4 py-3 text-right">
                {formatNumber(item.clicks)}
              </td>
              <td className="px-4 py-3 text-right">
                <RowActions item={item} onResult={onResult} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
