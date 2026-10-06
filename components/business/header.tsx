import Link from "next/link";
import { Wallet } from "lucide-react";

import { formatMoney } from "@/lib/formatters/currency";

import { BusinessUserMenu } from "./business-user-menu";
import { BUSINESS_SHELL } from "./constant/business-nav.constant";
import { MobileNav } from "./mobile-nav";

export function BusinessHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-surface/95 px-4 backdrop-blur">
      <MobileNav />
      <p className="min-w-0 flex-1 truncate text-sm font-semibold">
        {BUSINESS_SHELL.businessName}
      </p>
      <Link
        href={BUSINESS_SHELL.walletHref}
        className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors hover:border-foreground"
      >
        <Wallet className="size-4 text-primary" />
        {formatMoney(BUSINESS_SHELL.walletBalanceMinor)}
      </Link>
      <BusinessUserMenu />
    </header>
  );
}
