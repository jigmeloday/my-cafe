"use client";

import { useState } from "react";

import { FilterChips } from "@/components/shared/filter-chips";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DEFAULT_RANGE, RANGES, TABS } from "../constant/analytics.constant";
import { buildDataset } from "../utils/dataset.utils";
import { AudienceTab } from "./audience-tab";
import { BannersTab } from "./banners-tab";
import { EmailsTab } from "./emails-tab";
import { OverviewTab } from "./overview-tab";
import { PostsTab } from "./posts-tab";

const DATA = buildDataset();

export function AnalyticsExplorer() {
  const [rangeId, setRangeId] = useState(DEFAULT_RANGE);
  const range = RANGES.find((r) => r.id === rangeId)?.days ?? 14;

  return (
    <div className="space-y-4">
      <FilterChips options={RANGES} active={rangeId} onChange={setRangeId} />
      <Tabs defaultValue={TABS[0].id}>
        <TabsList>
          {TABS.map(({ id, label }) => (
            <TabsTrigger key={id} value={id}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="overview">
          <OverviewTab data={DATA} range={range} />
        </TabsContent>
        <TabsContent value="posts">
          <PostsTab data={DATA} range={range} />
        </TabsContent>
        <TabsContent value="banners">
          <BannersTab data={DATA} range={range} />
        </TabsContent>
        <TabsContent value="emails">
          <EmailsTab />
        </TabsContent>
        <TabsContent value="audience">
          <AudienceTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
