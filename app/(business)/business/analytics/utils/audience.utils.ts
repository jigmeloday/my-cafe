import type { BarItem } from "@/components/business/charts/model/chart.type";

import { FOLLOWERS_TOTAL } from "../../campaigns/constant/email-campaign.constant";
import { estimateRecipients } from "../../campaigns/utils/email-campaign.utils";
import {
  AUDIENCE_INTERESTS,
  AUDIENCE_LOCATIONS,
} from "../constant/analytics.constant";
import { apportion } from "./analytics.utils";

export function locationRows(total = FOLLOWERS_TOTAL): BarItem[] {
  const counts = apportion(
    total,
    AUDIENCE_LOCATIONS.map((l) => l.weight),
  );
  return AUDIENCE_LOCATIONS.map((l, i) => ({
    id: l.id,
    label: l.label,
    value: counts[i],
  }));
}

/** People can pick several interests, so these don't add up to the follower total. */
export const interestRows = (total = FOLLOWERS_TOTAL): BarItem[] =>
  AUDIENCE_INTERESTS.map((i) => ({
    id: i.id,
    label: i.label,
    value: Math.round((total * i.percent) / 100),
  }));

export function reachRows(total = FOLLOWERS_TOTAL): BarItem[] {
  const canEmail = estimateRecipients({
    locations: [],
    interests: [],
    birthdayThisMonth: false,
  });
  return [
    { id: "email", label: "Agreed to emails", value: canEmail },
    {
      id: "no-email",
      label: "Not emailed (opted out)",
      value: total - canEmail,
    },
  ];
}
