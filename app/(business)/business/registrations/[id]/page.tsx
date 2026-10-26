import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Download } from "lucide-react";

import { StatCard } from "@/components/business/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { eventDateText } from "@/lib/discovery-tags";
import { eventWindow, timeRangeText } from "@/lib/event-dates";
import { REGISTRATION_RETENTION_DAYS } from "@/lib/constants";
import { formatNumber } from "@/lib/formatters/number";
import { requireRole } from "@/lib/session";
import { registrationService } from "@/services/registration/registration.service";

import { AttendeesTable } from "../components/attendees-table";
import { EventInsights } from "../components/event-insights";
import { REGISTRATIONS_COPY as COPY } from "../constant/registrations.constant";

export const metadata: Metadata = { title: "Guest lists — Nook business" };

export default async function EventRegistrationsPage({ params }: PageProps<"/business/registrations/[id]">) {
  const user = await requireRole("BUSINESS_OWNER");
  const { id } = await params;
  const [found, insights] = await Promise.all([registrationService.attendees(user.id, id), registrationService.insights(user.id, id)]);
  if (!found || !insights) notFound();
  const { event, attendees, seatsLeft } = found;
  const win = eventWindow(event);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <Link href="/business/registrations" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" /> {COPY.back}
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <h1>{event.title}</h1>
            <p className="text-sm text-muted-foreground">{[eventDateText(win.start, win.end), timeRangeText(event.eventStartTime, event.eventEndTime), event.location].filter(Boolean).join(" · ")}</p>
          </div>
          {attendees.length > 0 && (
            <Button variant="secondary" nativeButton={false} render={<a href={`/api/business/registrations/${event.id}/csv`} download />}>
              <Download /> {COPY.download}
            </Button>
          )}
        </div>
      </header>
      <section aria-label="Summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label={COPY.registered} value={formatNumber(attendees.length)} hint={event.registrationEnabled ? undefined : COPY.closed} />
        <StatCard label={COPY.seatsLeft} value={seatsLeft === null ? COPY.unlimited : formatNumber(seatsLeft)} hint={event.capacity === null ? undefined : `${formatNumber(event.capacity)} seats in total`} />
      </section>
      <EventInsights views={insights.views} reserved={insights.reserved} perDay={insights.perDay} />
      {attendees.length > 0 ? (
        <>
          <AttendeesTable items={attendees} />
          <p className="text-xs text-muted-foreground">{COPY.privacy(REGISTRATION_RETENTION_DAYS)}</p>
        </>
      ) : (
        <EmptyState title={COPY.noOne} description={COPY.noOneHint} />
      )}
    </div>
  );
}
