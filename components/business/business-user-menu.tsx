"use client";

import Link from "next/link";
import { CircleUserRound, ExternalLink, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/server/actions/auth.actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { BUSINESS_SHELL } from "./constant/business-nav.constant";

export function BusinessUserMenu({ publicHref }: { publicHref: string | null }) {
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
        {publicHref && (
          <DropdownMenuItem render={<Link href={publicHref} />}>
            <ExternalLink /> {BUSINESS_SHELL.viewPublic}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem render={<Link href="/business/profile" />}>
          Business profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => logoutAction()}>
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
