import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { PromotionsExplorer } from "./components/promotions-explorer";
import { PROMOTIONS_COPY } from "./constant/promotion.constant";

export const metadata: Metadata = { title: "Promotions — kuzu business" };

export default function PromotionsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl space-y-1">
          <h1>{PROMOTIONS_COPY.title}</h1>
          <p className="text-sm text-muted-foreground">
            {PROMOTIONS_COPY.subtitle}
          </p>
        </div>
        <Button render={<Link href="/business/promotions/new" />}>
          <Plus /> {PROMOTIONS_COPY.create}
        </Button>
      </header>
      <PromotionsExplorer />
    </div>
  );
}
