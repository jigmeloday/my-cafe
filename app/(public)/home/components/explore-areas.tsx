"use client";

import Link from "next/link";
import { useState } from "react";

import type { AreaTab } from "../model/home.type";
import { getAreas } from "../utils/home.utils";
import { AreaTabs } from "./area-tabs";

export function ExploreAreas() {
  const [tab, setTab] = useState<AreaTab>("Thimphu");

  return (
    <section aria-labelledby="explore-areas" className="space-y-4">
      <h2 id="explore-areas">Explore by area</h2>
      <AreaTabs active={tab} onChange={setTab} />
      <ul className="grid grid-cols-2 gap-x-6 gap-y-6 pt-2 sm:grid-cols-3 lg:grid-cols-6">
        {getAreas(tab).map(({ name, description }) => (
          <li key={name}>
            <Link
              href={`/search?where=${encodeURIComponent(name)}`}
              className="block space-y-0.5 text-sm"
            >
              <span className="font-semibold hover:underline">{name}</span>
              <span className="block text-muted-foreground">{description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
