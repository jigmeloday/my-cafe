import type { BusinessEventType, PromotionEventKind, SiteSection } from "@/lib/track-events";

/** Where a visitor came from, read from the page they were on before: "/deals" -> "deals". */
export function sourceFromReferrer(referrer: string, origin: string): string {
  try {
    const url = new URL(referrer);
    if (url.origin !== origin) return "other";
    const first = url.pathname.split("/").filter(Boolean)[0];
    if (!first) return "home";
    return ["discover", "deals", "events", "search"].includes(first) ? first : "other";
  } catch {
    return "other";
  }
}

/** Sends one report to the server. Never blocks the page and never throws: counting must not break anything. */
function send(report: object) {
  const body = JSON.stringify(report);
  try {
    if (!navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) {
      void fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
    }
  } catch {
    // Counting must never break the page.
  }
}

const sourceNow = () => sourceFromReferrer(document.referrer, window.location.origin);

/** Tells the server a promotion was viewed, clicked or shared. */
export const trackEvent = (promotionId: string, type: PromotionEventKind) => send({ promotionId, type, source: sourceNow() });

/** Counts a banner being seen (VIEW) or clicked (CLICK). */
export const trackBanner = (bannerId: string, type: "VIEW" | "CLICK") => send({ bannerId, type });

/** Counts a visit to a business's page (VIEW) or a click on one of its contact links. */
export const trackBusiness = (businessSlug: string, type: BusinessEventType) => send({ businessSlug, type, source: sourceNow() });

/** Counts a page of the site being opened, for the admin's traffic numbers. */
export const trackSite = (section: SiteSection) => send({ section });
