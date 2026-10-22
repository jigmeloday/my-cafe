import type { BarItem, ChartPoint } from "@/components/business/charts/model/chart.type";
import { HISTORY_DAYS } from "@/app/(business)/business/analytics/constant/analytics.constant";
import type { Dataset, ProfileData, PromotionMeta } from "@/app/(business)/business/analytics/model/analytics.type";
import { addDays, lastDays } from "@/app/(business)/business/analytics/utils/analytics.utils";
import { buildDataset } from "@/app/(business)/business/analytics/utils/dataset.utils";
import { buildProfileData } from "@/app/(business)/business/analytics/utils/profile.utils";
import { analyticsRepository as repo } from "@/server/repositories/analytics.repository";
import { businessRepository } from "@/server/repositories/business.repository";

/** Bhutan is UTC+6 all year, so a Bhutan day is just a fixed shift from UTC. */
const bhutanDay = (date: Date) => new Date(date.getTime() + 6 * 3_600_000).toISOString().slice(0, 10);
/** The start of a Bhutan day, as a moment in time. */
const startOfBhutanDay = (day: string) => new Date(Date.parse(`${day}T00:00:00Z`) - 6 * 3_600_000);

const titleCase = (value: string) => value.charAt(0) + value.slice(1).toLowerCase();
const followHref = (slug: string) => `/businesses/${slug}`;

export interface Audience {
  followers: number;
  locations: BarItem[];
  interests: BarItem[];
  reach: BarItem[];
}

export interface BusinessAnalytics {
  data: Dataset;
  /** Visits to the business's own page and clicks on its contact links. */
  profile: ProfileData;
  metas: PromotionMeta[];
  audience: Audience;
  coins: BarItem[];
}

/** Counts how many times each value appears, biggest first. */
function tally(values: string[]): BarItem[] {
  const counts = new Map<string, number>();
  values.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1));
  return [...counts.entries()].map(([label, value]) => ({ id: label, label, value })).sort((a, b) => b.value - a.value);
}

/** What a follower chose to share. People who shared nothing are counted, but not guessed about. */
export function summariseAudience(
  profiles: { dzongkhag: string; interests: string[]; marketingConsent: boolean }[],
): Audience {
  const total = profiles.length;
  const consented = profiles.filter((p) => p.marketingConsent).length;
  const interests = tally(profiles.flatMap((p) => p.interests));
  return {
    followers: total,
    locations: tally(profiles.map((p) => p.dzongkhag || "Not shared")),
    interests,
    reach: [
      { id: "email", label: "Agreed to emails", value: consented },
      { id: "no-email", label: "Not emailed (opted out)", value: total - consented },
    ].filter((row) => total > 0 || row.value > 0),
  };
}

export const analyticsService = {
  /** Everything the Analytics screen shows, for the owner's business. A business with no activity gets zeros. */
  async forOwner(ownerId: string, now = new Date()): Promise<BusinessAnalytics> {
    const today = bhutanDay(now);
    const business = await businessRepository.findByOwner(ownerId);
    if (!business) {
      return { data: buildDataset(today, HISTORY_DAYS, [], [], []), profile: buildProfileData(today, HISTORY_DAYS, [], []), metas: [], audience: summariseAudience([]), coins: [] };
    }

    const since = startOfBhutanDay(addDays(today, -(HISTORY_DAYS - 1)));
    const promotions = await repo.publishedPromotions(business.id);
    const slugOf = new Map(promotions.map((p) => [p.slug, p.id]));

    const promotionIds = promotions.map((p) => p.id);
    const [events, saves, profiles, spent, reach, profileEvents, profileVisitors] = await Promise.all([
      repo.eventCounts(promotionIds, since),
      repo.savesSince([...slugOf.keys()], since),
      repo.followerProfiles(followHref(business.slug)),
      repo.coinsSpentByType(business.id),
      repo.promotionReachPerDay(promotionIds, since),
      repo.businessEventCounts(business.id, since),
      repo.businessVisitorsPerDay(business.id, since),
    ]);

    const saveRows = saves.flatMap((f) => {
      const promotionId = slugOf.get(f.href.slice(f.href.lastIndexOf("/") + 1));
      return promotionId ? [{ promotionId, day: bhutanDay(f.createdAt) }] : [];
    });

    return {
      data: buildDataset(today, HISTORY_DAYS, promotionIds, events, saveRows, reach),
      profile: buildProfileData(today, HISTORY_DAYS, profileEvents, profileVisitors),
      metas: promotions.map((p) => ({ id: p.id, title: p.title, type: titleCase(p.type), ended: p.status === "ENDED" })),
      audience: summariseAudience(profiles.map((p) => p.user.profile ?? { dzongkhag: "", interests: [], marketingConsent: false })),
      coins: spent.map((s) => ({ id: s.type, label: s.type, value: s.coins })).sort((a, b) => b.value - a.value),
    };
  },

  /** Followers now, and the running total for each of the last `days` days. */
  async followerSeries(ownerId: string, days: number, now = new Date()) {
    const business = await businessRepository.findByOwner(ownerId);
    const labels = lastDays(bhutanDay(now), days);
    if (!business) return { total: 0, points: labels.map(({ label }): ChartPoint => ({ label, values: { followers: 0 } })) };

    const href = followHref(business.slug);
    const since = startOfBhutanDay(labels[0].date);
    const [total, recent] = await Promise.all([repo.followersTotal(href), repo.followsSince(href, since)]);

    // Work backwards from today's total: each follow after a day's end isn't in that day's count.
    const gainedOn = new Map<string, number>();
    recent.forEach((f) => gainedOn.set(bhutanDay(f.createdAt), (gainedOn.get(bhutanDay(f.createdAt)) ?? 0) + 1));
    let running = total;
    const counts: number[] = [];
    for (let i = labels.length - 1; i >= 0; i--) {
      counts[i] = running;
      running -= gainedOn.get(labels[i].date) ?? 0;
    }
    return { total, points: labels.map(({ label }, i): ChartPoint => ({ label, values: { followers: counts[i] } })) };
  },
};

