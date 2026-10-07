import type { BarItem } from "@/components/business/charts/model/chart.type";

import { EMAIL_CAMPAIGNS } from "../../campaigns/constant/email-campaigns.data";
import type { EmailCampaignItem } from "../../campaigns/model/email-campaign.type";
import { sum } from "./analytics.utils";

/** Whole-number tenths of a percent: 528 means 52.8%. Zero when there is nothing to divide by. */
export const permille = (part: number, whole: number) =>
  whole === 0 ? 0 : Math.round((part * 1000) / whole);

/** Sent campaigns, oldest first so charts read left to right in time. */
export const sentCampaigns = (items: EmailCampaignItem[] = EMAIL_CAMPAIGNS) =>
  items
    .filter((c) => c.status === "SENT")
    .sort((a, b) => (a.sendAt < b.sendAt ? -1 : 1));

export function emailTotals(items: EmailCampaignItem[]) {
  const recipients = sum(items.map((c) => c.recipients));
  const opened = sum(items.map((c) => c.opened));
  const clicked = sum(items.map((c) => c.clicked));
  const unsubscribed = sum(items.map((c) => c.unsubscribed));
  return { campaigns: items.length, recipients, opened, clicked, unsubscribed };
}

export function emailBars(
  items: EmailCampaignItem[],
  metric: string,
): BarItem[] {
  return items.map((c) => ({
    id: c.id,
    label: c.name,
    value:
      metric === "open"
        ? permille(c.opened, c.recipients)
        : metric === "click"
          ? permille(c.clicked, c.recipients)
          : c.recipients,
  }));
}

export const emailFunnel = (items: EmailCampaignItem[]): BarItem[] => {
  const t = emailTotals(items);
  return [
    { id: "sent", label: "Emails delivered", value: t.recipients },
    { id: "opened", label: "Opened", value: t.opened },
    { id: "clicked", label: "Clicked a link", value: t.clicked },
  ];
};
