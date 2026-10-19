import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/session";
import { contactService } from "@/services/contact/contact.service";

import { MessageCard } from "./components/message-card";

export const metadata: Metadata = { title: "Messages — kuzu admin" };
export const dynamic = "force-dynamic";

export default async function AdminMessagesPage({ searchParams }: PageProps<"/admin/messages">) {
  // The layout also checks this, but a page must not rely on that: it reads people's messages.
  await requireRole("ADMIN");
  const showAll = (await searchParams).show === "all";
  const messages = await contactService.inbox(showAll ? "ALL" : "OPEN");

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl space-y-1">
          <h1>Messages</h1>
          <p className="text-sm text-muted-foreground">Messages people sent from the Contact page. Reply by email, then mark them done.</p>
        </div>
        <Button variant="secondary" nativeButton={false} render={<Link href={showAll ? "/admin/messages" : "/admin/messages?show=all"} />}>
          {showAll ? "Only waiting" : "Show all messages"}
        </Button>
      </header>
      {messages.length === 0 ? (
        <EmptyState title="No messages" description={showAll ? "Nobody has written yet." : "Nothing is waiting for a reply."} />
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {messages.map((m) => (
            <MessageCard key={m.id} message={m} />
          ))}
        </ul>
      )}
    </div>
  );
}
