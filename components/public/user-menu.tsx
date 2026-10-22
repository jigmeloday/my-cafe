"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Menu, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

import { SIGNED_IN_MENU, USER_MENU } from "./constant/site.constant";
import type { HeaderUser } from "./model/header-user.type";

export function UserMenu({ initialUser }: { initialUser: HeaderUser | null }) {
  const router = useRouter();
  const { data } = authClient.useSession();
  // The browser's answer when it has one; until then, what the server already knows.
  const user: HeaderUser | undefined = data?.user ?? initialUser ?? undefined;
  const account = user ? (SIGNED_IN_MENU.accounts[user.role] ?? SIGNED_IN_MENU.account) : SIGNED_IN_MENU.account;
  const dashboard = user ? SIGNED_IN_MENU.dashboards[user.role] : undefined;

  const logout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="secondary" aria-label="Open menu" className="h-11 gap-3 rounded-full px-3" />}
      >
        <Menu />
        <span className="grid size-7 place-items-center rounded-full bg-muted-foreground text-white">
          <UserRound className="size-4" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {user ? (
          <>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="truncate">{user.name}</DropdownMenuLabel>
              <DropdownMenuItem render={<Link href={account.href} />}>
                {account.label}
              </DropdownMenuItem>
              {dashboard && (
                <DropdownMenuItem render={<Link href={dashboard.href} />}>{dashboard.label}</DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={logout}>
              <LogOut /> {SIGNED_IN_MENU.logout}
            </DropdownMenuItem>
          </>
        ) : (
          USER_MENU.map(({ label, href }) => (
            <DropdownMenuItem key={href} render={<Link href={href} />}>
              {label}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
