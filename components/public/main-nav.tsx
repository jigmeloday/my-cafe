"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { MAIN_NAV } from "./constant/site.constant";

export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("items-center gap-1", className)}>
      {MAIN_NAV.map(({ label, href }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
              active &&
                "text-foreground after:absolute after:inset-x-3 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-foreground",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
