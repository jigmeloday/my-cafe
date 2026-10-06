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

import { BusinessNav } from "./business-nav";

export function MobileNav() {
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
          <SheetTitle className="sr-only">Dashboard menu</SheetTitle>
          <Brand />
        </SheetHeader>
        <BusinessNav onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
