import { cn } from "@/lib/utils";

import { BUSINESS_COPY } from "../constant/business.constant";
import type { BusinessHours } from "../model/business.type";
import { todayIndex } from "../utils/business.utils";

export function HoursList({ hours }: { hours: BusinessHours[] }) {
  const today = todayIndex();

  return (
    <ul className="space-y-1.5 text-sm">
      {hours.map(({ day, hours: time }, i) => (
        <li
          key={day}
          className={cn(
            "flex justify-between gap-4",
            i === today && "font-semibold",
          )}
        >
          <span>
            {day}
            {i === today && (
              <span className="ml-2 text-xs text-primary">
                {BUSINESS_COPY.today}
              </span>
            )}
          </span>
          <span
            className={cn(
              time === BUSINESS_COPY.closed && "text-muted-foreground",
            )}
          >
            {time}
          </span>
        </li>
      ))}
    </ul>
  );
}
