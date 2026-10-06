"use client";

import Link from "next/link";
import { CircleUserRound, ExternalLink, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { BUSINESS_SHELL } from "./constant/business-nav.constant";

export function BusinessUserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Account menu" />
        }
      >
        <CircleUserRound className="size-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem render={<Link href={BUSINESS_SHELL.publicHref} />}>
          <ExternalLink /> {BUSINESS_SHELL.viewPublic}
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/profile" />}>
          My account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
