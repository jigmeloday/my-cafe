"use client";

import Link from "next/link";
import { useState } from "react";

import type { AreaGroup } from "@/services/discovery/discovery.service";

import { AreaTabs } from "./area-tabs";

/** Where Nook's businesses are, by dzongkhag and town. Each town links to a search for that place. */
export function ExploreAreas({ areas }: { areas: AreaGroup[] }) {
  const [tab, setTab] = useState(areas[0]?.name ?? "");
  const active = areas.find((a) => a.name === tab) ?? areas[0];
  if (!active) return null;

  return (
    <section aria-labelledby="explore-areas" className="space-y-4">
      <h2 id="explore-areas">Explore by area</h2>
      <AreaTabs tabs={areas.map((a) => a.name)} active={active.name} onChange={setTab} />
      <ul className="grid grid-cols-2 gap-x-6 gap-y-6 pt-2 sm:grid-cols-3 lg:grid-cols-6">
        {active.towns.map(({ name, description }) => (
          <li key={name}>
            <Link href={`/search?where=${encodeURIComponent(name)}`} className="block space-y-0.5 text-sm">
              <span className="font-semibold hover:underline">{name}</span>
              <span className="block text-muted-foreground">{description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
