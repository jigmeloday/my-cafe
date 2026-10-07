import { StatusBadge } from "@/components/shared/status-badge";
import { formatNumber } from "@/lib/formatters/number";

import { TRANSACTION_TYPE } from "../../wallet/constant/wallet.constant";
import type { TransactionRow } from "../../wallet/model/wallet.type";
import {
  formatSignedCoins,
  formatTransactionDate,
} from "../../wallet/utils/wallet.utils";

const HEADERS = ["Date", "Description", "Type", "Coins", "Balance"];

export function TransactionsTable({ rows }: { rows: TransactionRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-surface">
      <table className="w-full min-w-[40rem] text-sm">
        <thead className="text-left text-xs text-muted-foreground">
          <tr className="border-b">
            {HEADERS.map((h, i) => (
              <th
                key={h}
                className={`px-4 py-3 font-medium ${i >= 3 ? "text-right" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y tabular-nums">
          {rows.map(({ id, type, description, amount, date, balanceAfter }) => {
            const { label, tone } = TRANSACTION_TYPE[type];
            return (
              <tr key={id}>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {formatTransactionDate(date)}
                </td>
                <td className="px-4 py-3">{description}</td>
                <td className="px-4 py-3">
                  <StatusBadge tone={tone}>{label}</StatusBadge>
                </td>
                <td
                  className={`px-4 py-3 text-right font-semibold ${amount > 0 ? "text-success" : ""}`}
                >
                  {formatSignedCoins(amount)}
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {formatNumber(balanceAfter)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
