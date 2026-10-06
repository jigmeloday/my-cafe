import { ImagePlaceholder } from "@/components/shared/image-placeholder";

import {
  BUSINESS_CONTACTS,
  BUSINESS_COPY,
} from "../constant/business.constant";
import type { BusinessHours } from "../model/business.type";
import { HoursList } from "./hours-list";

export function BusinessInfoCard({ hours }: { hours: BusinessHours[] }) {
  return (
    <aside className="space-y-6 rounded-2xl border p-5 lg:sticky lg:top-24">
      <section className="space-y-3">
        <h3>{BUSINESS_COPY.hours}</h3>
        <HoursList hours={hours} />
      </section>
      <section className="space-y-3 border-t pt-5">
        <h3>{BUSINESS_COPY.contact}</h3>
        <ul className="space-y-2.5 text-sm">
          {BUSINESS_CONTACTS.map(({ key, icon: Icon, text }) => (
            <li
              key={key}
              className="flex items-center gap-3 text-muted-foreground"
            >
              <Icon className="size-4 shrink-0 text-foreground" />
              <span className="truncate">{text}</span>
            </li>
          ))}
        </ul>
        <ImagePlaceholder label="Map" className="aspect-video rounded-xl" />
      </section>
    </aside>
  );
}
