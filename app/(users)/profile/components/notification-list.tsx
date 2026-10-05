import { Bell } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";

import { PROFILE_COPY } from "../constant/profile.constant";
import { NOTIFICATIONS } from "../constant/profile.data";

export function NotificationList({ limit }: { limit?: number }) {
  const items = NOTIFICATIONS.slice(0, limit);
  if (items.length === 0) {
    return (
      <EmptyState
        title={PROFILE_COPY.notificationsEmptyTitle}
        description={PROFILE_COPY.notificationsEmptyDescription}
      />
    );
  }

  return (
    <ul className="divide-y border-y">
      {items.map(({ id, title, description, time }) => (
        <li key={id} className="flex items-start gap-4 py-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-maroon-soft text-primary">
            <Bell className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">{time}</span>
        </li>
      ))}
    </ul>
  );
}
