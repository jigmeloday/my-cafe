import { Building2, CalendarDays, Tag } from "lucide-react";

import type { AboutTile, SiteStats } from "../model/about.type";

const plural = (count: number, one: string, many: string) => (count === 1 ? one : many);

/** A box shows its number only when there is something to count, so the page never says "0 events coming up". */
function tile(icon: AboutTile["icon"], count: number, counted: { one: string; many: string }, idle: string, text: string): AboutTile {
  return count > 0 ? { icon, label: plural(count, counted.one, counted.many), value: count, text } : { icon, label: idle, text };
}

/** The three boxes in the opening section: live numbers where there are some, otherwise what each one is. */
export function heroTiles(stats: SiteStats): AboutTile[] {
  return [
    tile(Tag, stats.deals, { one: "live deal", many: "live deals" }, "Deals", "Offers from local businesses"),
    tile(CalendarDays, stats.events, { one: "event coming up", many: "events coming up" }, "Events", "Things to do, soonest first"),
    tile(Building2, stats.businesses, { one: "business", many: "businesses" }, "Places", "Local places to discover"),
  ];
}
