import Link from "next/link";
import { Megaphone, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { DASHBOARD_COPY } from "../constant/dashboard.constant";

export function DashboardHeader() {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-1">
        <h1>{DASHBOARD_COPY.title}</h1>
        <p className="text-sm text-muted-foreground">
          {DASHBOARD_COPY.subtitle}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          render={<Link href="/business/promotions/new" />}
          variant="secondary"
        >
          <Plus /> {DASHBOARD_COPY.createPromotion}
        </Button>
        <Button render={<Link href="/business/campaigns/new" />}>
          <Megaphone /> {DASHBOARD_COPY.createCampaign}
        </Button>
      </div>
    </header>
  );
}
