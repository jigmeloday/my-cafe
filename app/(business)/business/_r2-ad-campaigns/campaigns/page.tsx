import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { CampaignsExplorer } from "./components/campaigns-explorer";
import { CAMPAIGNS_COPY } from "./constant/campaign.constant";

export const metadata: Metadata = { title: "Campaigns — kuzu business" };

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl space-y-1">
          <h1>{CAMPAIGNS_COPY.title}</h1>
          <p className="text-sm text-muted-foreground">
            {CAMPAIGNS_COPY.subtitle}
          </p>
        </div>
        <Button render={<Link href="/business/campaigns/new" />}>
          <Plus /> {CAMPAIGNS_COPY.create}
        </Button>
      </header>
      <CampaignsExplorer />
    </div>
  );
}
