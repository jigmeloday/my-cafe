"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { NAV_ICONS } from "./icons";
import type { DashboardNavItem } from "./model/nav.type";

interface DashboardNavProps {
  items: DashboardNavItem[];
  label: string;
  onNavigate?: () => void;
}

export function DashboardNav({ items, label, onNavigate }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="space-y-1">
      {items.map(({ label: text, href, icon }) => {
        const Icon = NAV_ICONS[icon];
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              active &&
                "bg-maroon-soft font-semibold text-primary hover:bg-maroon-soft hover:text-primary",
            )}
          >
            <Icon className="size-4" />
            {text}
          </Link>
        );
      })}
    </nav>
  );
}
