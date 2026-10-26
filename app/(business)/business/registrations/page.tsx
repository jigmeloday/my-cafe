import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/session";
import { registrationService } from "@/services/registration/registration.service";

import { EventsTable } from "./components/events-table";
import { REGISTRATIONS_COPY } from "./constant/registrations.constant";

export const metadata: Metadata = { title: "Guest lists — Nook business" };

export default async function RegistrationsPage() {
  const user = await requireRole("BUSINESS_OWNER");
  const events = await registrationService.eventsWithCounts(user.id);

  return (
    <div className="space-y-6">
      <header className="max-w-2xl space-y-1">
        <h1>{REGISTRATIONS_COPY.title}</h1>
        <p className="text-sm text-muted-foreground">{REGISTRATIONS_COPY.subtitle}</p>
      </header>
      {events.length > 0 ? (
        <EventsTable items={events} />
      ) : (
        <EmptyState
          title={REGISTRATIONS_COPY.emptyTitle}
          description={REGISTRATIONS_COPY.emptyDescription}
          action={
            <Button render={<Link href="/business/promotions/new" />}>
              <Plus /> {REGISTRATIONS_COPY.emptyAction}
            </Button>
          }
        />
      )}
    </div>
  );
}
