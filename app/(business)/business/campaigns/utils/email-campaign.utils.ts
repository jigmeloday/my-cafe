import { formatDateTime } from "@/lib/formatters/date";
import { formatPercent } from "@/lib/formatters/number";
import type { EmailCampaignInput } from "@/lib/validations/email-campaign.schema";

import { PROMOTION_ITEMS } from "../../promotions/constant/promotions.data";
import {
  FOLLOWERS_TOTAL,
  OPT_IN_RATE,
} from "../constant/email-campaign.constant";
import type {
  AudienceFilters,
  EmailCampaignFilters,
  EmailCampaignItem,
} from "../model/email-campaign.type";

export function filterCampaigns(
  items: EmailCampaignItem[],
  filters: EmailCampaignFilters,
) {
  const query = filters.query.trim().toLowerCase();
  return items.filter(
    (c) =>
      (filters.status === "ALL" || c.status === filters.status) &&
      (!query ||
        c.name.toLowerCase().includes(query) ||
        c.subject.toLowerCase().includes(query)),
  );
}

export const countByStatus = (
  items: EmailCampaignItem[],
  status: EmailCampaignFilters["status"],
) =>
  status === "ALL"
    ? items.length
    : items.filter((c) => c.status === status).length;

export const canEdit = (status: EmailCampaignItem["status"]) =>
  status === "DRAFT" || status === "SCHEDULED";

const ratio = (part: number, whole: number) => (whole === 0 ? 0 : part / whole);
export const openRate = (c: Pick<EmailCampaignItem, "opened" | "recipients">) =>
  ratio(c.opened, c.recipients);
export const clickRate = (
  c: Pick<EmailCampaignItem, "clicked" | "recipients">,
) => ratio(c.clicked, c.recipients);
export const formatRate = (value: number) => formatPercent(value, 1);

export const formatSendAt = formatDateTime;

export function toFormValues(item: EmailCampaignItem): EmailCampaignInput {
  const [sendDate = "", sendTime = ""] = item.sendAt.split("T");
  return {
    name: item.name,
    subject: item.subject,
    previewText: item.previewText,
    body: item.body,
    promotionId: item.promotionId,
    locations: item.locations,
    interests: item.interests,
    birthdayThisMonth: item.birthdayThisMonth,
    sendMode: item.status === "SCHEDULED" ? "LATER" : "NOW",
    sendDate,
    sendTime,
    intent: "DRAFT",
  };
}

/** Sample estimate: followers who opted in, narrowed by each filter. Replace with a real count. */
export function estimateRecipients({
  locations,
  interests,
  birthdayThisMonth,
}: AudienceFilters): number {
  let share = OPT_IN_RATE;
  if (locations.length) share *= Math.min(1, 0.4 * locations.length);
  if (interests.length)
    share *= Math.min(1, 0.45 + 0.15 * (interests.length - 1));
  if (birthdayThisMonth) share *= 0.09;
  return Math.round(FOLLOWERS_TOTAL * share);
}

/** Only published promotions can be featured. */
export const publishedPromotionOptions = () =>
  PROMOTION_ITEMS.filter((p) => p.status === "PUBLISHED").map((p) => ({
    value: p.id,
    label: p.values.title,
  }));
