"use client";

import { useState } from "react";

import { FilterChips } from "@/components/shared/filter-chips";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BusinessAnalytics } from "@/services/analytics/analytics.service";

import { DEFAULT_RANGE, RANGES, TABS } from "../constant/analytics.constant";
import { AudienceTab } from "./audience-tab";
import { OverviewTab } from "./overview-tab";
import { PostsTab } from "./posts-tab";
import { ProfileTab } from "./profile-tab";

export function AnalyticsExplorer({ analytics }: { analytics: BusinessAnalytics }) {
  const [rangeId, setRangeId] = useState(DEFAULT_RANGE);
  const range = RANGES.find((r) => r.id === rangeId)?.days ?? 14;
  const { data, profile, banners, metas, audience, coins } = analytics;

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
          <OverviewTab data={data} banners={banners} range={range} coins={coins} />
        </TabsContent>
        <TabsContent value="profile">
          <ProfileTab profile={profile} range={range} />
        </TabsContent>
        <TabsContent value="posts">
          <PostsTab data={data} range={range} metas={metas} />
        </TabsContent>
        <TabsContent value="audience">
          <AudienceTab audience={audience} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
