/**
 * Works out the filter tags for the Deals, Events and New places pages from real data. Pure functions, so the rules
 * are easy to read and test. The tag ids match the filter chips on those pages.
 */
const DAY_MS = 86_400_000;

interface Dated {
  startsAt: Date | null;
  endsAt: Date | null;
}

interface Taggable extends Dated {
  title: string;
  description: string;
  discount: string;
  /** The promotion's category name, if it has one. */
  category: string | null;
}

const daysBetween = (from: Date, to: Date) => Math.round((to.getTime() - from.getTime()) / DAY_MS);
const text = (p: Taggable) => `${p.title} ${p.description} ${p.discount}`.toLowerCase();

/** Category names -> the topic filters used on the Deals page. */
const DEAL_TOPIC: Record<string, string> = { Food: "food", Cafés: "food", Fashion: "fashion", Phones: "electronics", Wellness: "wellness" };

export function dealTags(p: Taggable, today: Date): string[] {
  const tags: string[] = [];
  if (p.endsAt && p.endsAt.getTime() === today.getTime()) tags.push("today");
  if (p.endsAt && daysBetween(today, p.endsAt) >= 0 && daysBetween(today, p.endsAt) <= 6) tags.push("week");
  if (/buy\s*1\s*get\s*1|bogo|two for one|2 for 1|\bbuy one\b.*\bget one\b/.test(`${p.title} ${p.discount}`.toLowerCase())) tags.push("bogo");
  if (p.discount.includes("%")) tags.push("percent");
  const topic = p.category ? DEAL_TOPIC[p.category] : undefined;
  if (topic) tags.push(topic);
  return tags;
}

/** Is this date a Saturday or Sunday that is within the coming week? */
const isComingWeekend = (date: Date, today: Date) => {
  const day = date.getUTCDay();
  return (day === 6 || day === 0) && daysBetween(today, date) >= 0 && daysBetween(today, date) <= 6;
};

export function eventTags(p: Taggable, today: Date): string[] {
  const tags: string[] = [];
  const t = text(p);
  if (p.startsAt && isComingWeekend(p.startsAt, today)) tags.push("weekend");
  if (/\bfree\b/.test(p.discount.toLowerCase())) tags.push("free");
  if (/music|band|concert|open mic|gig|singer|acoustic/.test(t)) tags.push("music");
  if (p.category === "Food" || p.category === "Cafés" || /food|dinner|tasting|cook|dish|wine|cuisine/.test(t)) tags.push("food");
  if (p.category === "Festival" || /dance|culture|cultural|thangka|traditional|craft|fair|festival|weav/.test(t)) tags.push("culture");
  if (p.category === "Kids" || /\bkids?\b|children|family/.test(t)) tags.push("kids");
  if (/archery|football|sport|match|race|relay|tournament/.test(t)) tags.push("sports");
  return tags;
}

/** Category names -> the filters used on the New places page. */
const PLACE_TOPIC: Record<string, string> = { Food: "food", Cafés: "cafe", Fashion: "shops", Phones: "shops", Home: "shops", Services: "shops", Wellness: "wellness", Stays: "stays" };

/** The category most of a business's promotions are in, or null when it has none. */
export function mainCategory(categories: (string | null)[]): string | null {
  const counts = new Map<string, number>();
  categories.forEach((c) => c && counts.set(c, (counts.get(c) ?? 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

export function placeTags(createdAt: Date, mainCat: string | null, now: Date): string[] {
  const tags: string[] = [];
  const age = (now.getTime() - createdAt.getTime()) / DAY_MS;
  if (age <= 7) tags.push("week");
  if (age <= 30) tags.push("month");
  const topic = mainCat ? PLACE_TOPIC[mainCat] : undefined;
  if (topic) tags.push(topic);
  return tags;
}

/** "Opened this week", "Opened 2 weeks ago", "Opened 3 months ago". */
export function openedText(createdAt: Date, now: Date): string {
  const days = Math.floor((now.getTime() - createdAt.getTime()) / DAY_MS);
  if (days < 1) return "Opened today";
  if (days <= 7) return "Opened this week";
  if (days < 30) return `Opened ${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `Opened ${Math.floor(days / 30)} ${Math.floor(days / 30) === 1 ? "month" : "months"} ago`;
  return "Open for over a year";
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayLabel = (d: Date) => `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;

/** "Sat 24 Oct", or "Sat 24 Oct – Sun 25 Oct" for events over several days. */
export function eventDateText(startsAt: Date | null, endsAt: Date | null): string {
  if (!startsAt) return endsAt ? `Until ${dayLabel(endsAt)}` : "Date to be confirmed";
  if (!endsAt || endsAt.getTime() === startsAt.getTime()) return dayLabel(startsAt);
  return `${dayLabel(startsAt)} – ${dayLabel(endsAt)}`;
}
