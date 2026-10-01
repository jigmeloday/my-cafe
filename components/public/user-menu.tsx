"use client";

import Link from "next/link";
import { Menu, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { USER_MENU } from "./constant/site.constant";

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="secondary"
            aria-label="Open menu"
            className="h-11 gap-3 rounded-full px-3"
          />
        }
      >
        <Menu />
        <span className="grid size-7 place-items-center rounded-full bg-muted-foreground text-white">
          <UserRound className="size-4" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {USER_MENU.map(({ label, href }) => (
          <DropdownMenuItem key={href} render={<Link href={href} />}>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
