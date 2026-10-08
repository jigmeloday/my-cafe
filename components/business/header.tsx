import Link from "next/link";
import { Coins } from "lucide-react";

import { formatNumber } from "@/lib/formatters/number";

import { DashboardMobileNav } from "@/components/dashboard/dashboard-mobile-nav";

import { BusinessUserMenu } from "./business-user-menu";
import { BUSINESS_NAV, BUSINESS_SHELL } from "./constant/business-nav.constant";

export function BusinessHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-surface/95 px-4 backdrop-blur">
      <DashboardMobileNav items={BUSINESS_NAV} label="Business" />
      <p className="min-w-0 flex-1 truncate text-sm font-semibold">
        {BUSINESS_SHELL.businessName}
      </p>
      <Link
        href={BUSINESS_SHELL.walletHref}
        aria-label="Wallet balance"
        className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium tabular-nums transition-colors hover:border-foreground"
      >
        <Coins className="size-4 text-gold" />
        {formatNumber(BUSINESS_SHELL.walletCoins)}
      </Link>
      <BusinessUserMenu />
    </header>
  );
}
