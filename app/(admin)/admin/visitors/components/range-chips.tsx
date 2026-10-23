"use client";

import { usePathname, useRouter } from "next/navigation";

import { FilterChips } from "@/components/shared/filter-chips";

import { RANGES } from "../constant/visitors.constant";

/** Picks how many days to look at. The choice goes in the address, so the page can be shared or reloaded. */
export function RangeChips({ active }: { active: string }) {
  const router = useRouter();
  const pathname = usePathname();

  return <FilterChips options={RANGES} active={active} onChange={(id) => router.replace(`${pathname}?range=${id}`, { scroll: false })} />;
}
