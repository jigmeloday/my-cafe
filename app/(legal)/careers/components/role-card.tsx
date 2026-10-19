import { Button } from "@/components/ui/button";
import { LEGAL } from "@/lib/legal";

import type { Role } from "../constant/careers.constant";

/** The contact address is a placeholder until the company fills it in: then show it as text, not a broken link. */
const canEmail = !LEGAL.contactEmail.startsWith("[");

export function RoleCard({ role }: { role: Role }) {
  return (
    <article id={role.id} className="scroll-mt-24 space-y-4 rounded-2xl border bg-surface p-5 sm:p-6">
      <header className="space-y-1">
        <h3>{role.title}</h3>
        <p className="text-sm text-muted-foreground">
          {role.team} · {role.location} · {role.type}
        </p>
      </header>
      <p className="text-muted-foreground">{role.summary}</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <h6>What you will do</h6>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {role.doing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <h6>What we are looking for</h6>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {role.looking.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      {canEmail ? (
        <Button nativeButton={false} render={<a href={`mailto:${LEGAL.contactEmail}?subject=${encodeURIComponent(`Application: ${role.title}`)}`} />}>
          Apply by email
        </Button>
      ) : (
        <p className="text-sm text-muted-foreground">To apply, email {LEGAL.contactEmail} and mention “{role.title}”.</p>
      )}
    </article>
  );
}
