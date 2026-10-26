import type { Metadata } from "next";

import { eventWindow } from "@/lib/event-dates";
import { requireRole } from "@/lib/session";
import { registrationService } from "@/services/registration/registration.service";
import { bhutanToday } from "@/services/discovery/discovery.service";

import { MyEvents } from "../components/my-events";
import { ProfileSection } from "../components/profile-section";
import { MY_EVENTS_COPY } from "../constant/my-events.constant";
import type { MyEvent } from "../model/my-events.type";

export const metadata: Metadata = { title: "My events — Nook" };

const day = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "");

export default async function MyEventsPage() {
  // The layout checks this too, but a page must not rely on that.
  const user = await requireRole("USER", "ADMIN");
  const today = bhutanToday();
  const rows = await registrationService.myEvents(user.id);

  const events: MyEvent[] = rows.map(({ id, promotion: p }) => {
    const { start, end } = eventWindow(p);
    return {
      id,
      promotionId: p.id,
      title: p.title,
      businessName: p.business.name,
      location: p.location,
      when: day(start ?? end),
      href: `/events/${p.slug}`,
      over:
        p.removedAt !== null ||
        p.status !== "PUBLISHED" ||
        (end !== null && end < today),
    };
  });

  return (
    <ProfileSection
      id="events"
      title={MY_EVENTS_COPY.title}
      description={MY_EVENTS_COPY.description}
    >
      <MyEvents events={events} />
    </ProfileSection>
  );
}
