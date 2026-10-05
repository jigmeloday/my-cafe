"use client";

import { motion } from "framer-motion";

import { PromotionGrid } from "@/components/public/promotion-grid";
import { EmptyState } from "@/components/shared/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { ACTIVITY_TABS } from "../constant/business.constant";
import type { ActivityItem } from "../model/business.type";
import { itemsByStatus } from "../utils/business.utils";

export function BusinessActivity({ items }: { items: ActivityItem[] }) {
  const firstWithItems = ACTIVITY_TABS.find(
    (t) => itemsByStatus(items, t.id).length > 0,
  );

  return (
    <Tabs defaultValue={firstWithItems?.id ?? ACTIVITY_TABS[0].id}>
      <TabsList>
        {ACTIVITY_TABS.map(({ id, label }) => (
          <TabsTrigger key={id} value={id}>
            {label}
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
              {itemsByStatus(items, id).length}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
      {ACTIVITY_TABS.map(({ id, emptyTitle, emptyDescription }) => {
        const tabItems = itemsByStatus(items, id);
        return (
          <TabsContent key={id} value={id}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {tabItems.length > 0 ? (
                <PromotionGrid
                  items={tabItems}
                  className={cn(
                    "md:grid-cols-3 xl:grid-cols-4",
                    id === "past" && "opacity-70",
                  )}
                />
              ) : (
                <EmptyState title={emptyTitle} description={emptyDescription} />
              )}
            </motion.div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
