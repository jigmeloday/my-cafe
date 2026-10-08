import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate, formatDateTime } from "@/lib/formatters/date";
import type { ActionResult } from "@/server/actions/action.type";

import {
  ROLE_LABELS,
  ROLE_TONES,
  USER_STATUS,
} from "../constant/user.constant";
import type { AdminUser } from "../model/user.type";
import { initials } from "../utils/user.utils";
import { UserRowActions } from "./user-row-actions";

const HEADERS = ["User", "Role", "Status", "Joined", "Last active", ""];

interface UsersTableProps {
  items: AdminUser[];
  onResult: (result: ActionResult) => void;
}

export function UsersTable({ items, onResult }: UsersTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-surface">
      <table className="w-full min-w-[46rem] text-sm">
        <thead className="text-left text-xs text-muted-foreground">
          <tr className="border-b">
            {HEADERS.map((h, i) => (
              <th key={h || i} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y tabular-nums">
          {items.map((u) => {
            const status = USER_STATUS[u.status];
            return (
              <tr key={u.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="grid size-9 shrink-0 place-items-center rounded-full bg-maroon-soft text-xs font-semibold text-primary"
                    >
                      {initials(u.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{u.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {u.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge tone={ROLE_TONES[u.role]}>
                    {ROLE_LABELS[u.role]}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {formatDate(u.joined)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {formatDateTime(u.lastActive)}
                </td>
                <td className="px-4 py-3 text-right">
                  <UserRowActions item={u} onResult={onResult} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
