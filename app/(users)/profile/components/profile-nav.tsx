"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { PROFILE_NAV } from "../constant/profile.constant";

export function ProfileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Profile"
      className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 md:mx-0 md:flex-col md:gap-6 md:px-0"
    >
      {PROFILE_NAV.map(({ title, items }) => (
        <div key={title} className="flex gap-2 md:flex-col md:gap-1">
          <p className="hidden px-3 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase md:block">
            {title}
          </p>
          {items.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  active && "bg-muted font-semibold text-foreground",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
