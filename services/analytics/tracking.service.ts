import type { BusinessEventType, PromotionEventKind, SiteSection } from "@/lib/track-events";
import { currentVisitor } from "@/lib/visitor";
import { analyticsRepository as repo } from "@/server/repositories/analytics.repository";

/** Opening the same page again within this time is the same visit (a reload, or the back button). */
const SAME_VISIT_MINUTES = 30;
/** Most clicks of one kind one visitor can add to one place in a day, so a script can't inflate the numbers. */
const CLICKS_PER_DAY = 5;
/** Most pages one visitor can add to the site's traffic in a day. */
const SITE_VISITS_PER_DAY = 300;

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000);
const DAY_MINUTES = 24 * 60;

/** Whether this visitor may add one more of `type`: a view only once per visit, a click up to a daily limit. */
const allowed = (isView: boolean, recent: (since: Date) => Promise<number>) =>
  isView ? recent(minutesAgo(SAME_VISIT_MINUTES)).then((n) => n === 0) : recent(minutesAgo(DAY_MINUTES)).then((n) => n < CLICKS_PER_DAY);

/**
 * Counts what visitors do. Robots are never counted, nobody can count the same thing over and over, and an owner
 * looking at their own page isn't an audience. Every method answers whether something was counted.
 */
export const trackingService = {
  async promotion(input: { promotionId: string; type: PromotionEventKind; source: string }, viewerId: string | null): Promise<boolean> {
    const visitor = await currentVisitor();
    if (!visitor || !(await repo.isCountable(input.promotionId, viewerId))) return false;
    if (!(await allowed(input.type === "VIEW", (since) => repo.recentPromotionEvents(input.promotionId, input.type, visitor, since)))) return false;
    await repo.recordEvent(input.promotionId, input.type, input.source, visitor);
    return true;
  },

  async business(input: { slug: string; type: BusinessEventType; source: string }, viewerId: string | null): Promise<boolean> {
    const visitor = await currentVisitor();
    const business = visitor ? await repo.countableBusiness(input.slug, viewerId) : null;
    if (!visitor || !business) return false;
    if (!(await allowed(input.type === "VIEW", (since) => repo.recentBusinessEvents(business.id, input.type, visitor, since)))) return false;
    await repo.recordBusinessEvent(business.id, input.type, input.source, visitor);
    return true;
  },

  async site(section: SiteSection): Promise<boolean> {
    const visitor = await currentVisitor();
    if (!visitor || (await repo.siteVisitsSince(visitor, minutesAgo(DAY_MINUTES))) >= SITE_VISITS_PER_DAY) return false;
    await repo.recordSiteVisit(section, visitor);
    return true;
  },
};
