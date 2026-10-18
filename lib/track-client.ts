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

/** Tells the server a promotion was viewed or clicked. Never blocks the page and never throws. */
export function trackEvent(promotionId: string, type: "VIEW" | "CLICK") {
  const source = sourceFromReferrer(document.referrer, window.location.origin);
  const body = JSON.stringify({ promotionId, type, source });
  try {
    if (!navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) {
      void fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
    }
  } catch {
    // Counting a view must never break the page.
  }
}

/** Counts a banner being seen (VIEW) or clicked (CLICK). Never blocks the page and never throws. */
export function trackBanner(bannerId: string, type: "VIEW" | "CLICK") {
  const body = JSON.stringify({ bannerId, type });
  try {
    if (!navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) {
      void fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
    }
  } catch {
    // Counting must never break the page.
  }
}
