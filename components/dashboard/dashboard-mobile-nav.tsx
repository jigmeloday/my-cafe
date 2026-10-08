"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { Brand } from "@/components/public/brand";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { DashboardNav } from "./dashboard-nav";
import type { DashboardNavItem } from "./model/nav.type";

interface DashboardMobileNavProps {
  items: DashboardNavItem[];
  label: string;
}

export function DashboardMobileNav({ items, label }: DashboardMobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            className="lg:hidden"
          />
        }
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="gap-6 p-4">
        <SheetHeader className="p-0">
          <SheetTitle className="sr-only">{label} menu</SheetTitle>
          <Brand />
        </SheetHeader>
        <DashboardNav
          items={items}
          label={label}
          onNavigate={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
