import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { CampaignsExplorer } from "./components/campaigns-explorer";
import { EMAIL_COPY } from "./constant/email-campaign.constant";

export const metadata: Metadata = { title: "Campaigns — kuzu business" };

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl space-y-1">
          <h1>{EMAIL_COPY.title}</h1>
          <p className="text-sm text-muted-foreground">{EMAIL_COPY.subtitle}</p>
        </div>
        <Button render={<Link href="/business/campaigns/new" />}>
          <Plus /> {EMAIL_COPY.create}
        </Button>
      </header>
      <CampaignsExplorer />
    </div>
  );
}
