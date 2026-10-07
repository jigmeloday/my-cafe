import type { CampaignItem, RecentClick } from "../model/campaign.type";

const base: Pick<
  CampaignItem,
  | "dailyBudgetMinor"
  | "destination"
  | "destinationUrl"
  | "locations"
  | "interests"
  | "schedule"
  | "startDate"
  | "endDate"
> = {
  dailyBudgetMinor: null,
  destination: "PROMOTION",
  destinationUrl: "",
  locations: ["Thimphu"],
  interests: [],
  schedule: "ALWAYS",
  startDate: "2026-10-05",
  endDate: "",
};

// Sample data: replaced by the business's real campaigns once the database exists.
export const CAMPAIGN_ITEMS: CampaignItem[] = [
  {
    ...base,
    id: "c1",
    name: "Tshechu weekend push",
    promotionId: "p1",
    status: "ACTIVE",
    cpcMinor: 50,
    dailyBudgetMinor: 1000,
    budgetMinor: 5000,
    spentMinor: 3350,
    impressions: 2410,
    clicks: 67,
    schedule: "WEEKENDS",
    interests: ["Fashion"],
  },
  {
    ...base,
    id: "c2",
    name: "Opening week menu",
    promotionId: "p2",
    status: "ACTIVE",
    cpcMinor: 40,
    budgetMinor: 8000,
    spentMinor: 2160,
    impressions: 1520,
    clicks: 54,
    interests: ["Food"],
  },
  {
    ...base,
    id: "c3",
    name: "Night market stall",
    promotionId: "p3",
    status: "PAUSED",
    cpcMinor: 40,
    budgetMinor: 3000,
    spentMinor: 1200,
    impressions: 890,
    clicks: 30,
    endDate: "2026-10-10",
  },
  {
    ...base,
    id: "c4",
    name: "Winter coats",
    promotionId: "p5",
    status: "SCHEDULED",
    cpcMinor: 50,
    budgetMinor: 4000,
    spentMinor: 0,
    impressions: 0,
    clicks: 0,
    startDate: "2026-10-12",
    endDate: "2026-10-31",
  },
  {
    ...base,
    id: "c5",
    name: "Summer sale",
    promotionId: "p6",
    status: "COMPLETED",
    cpcMinor: 50,
    budgetMinor: 5000,
    spentMinor: 5000,
    impressions: 3320,
    clicks: 100,
    startDate: "2026-07-01",
    endDate: "2026-08-15",
  },
  {
    ...base,
    id: "c6",
    name: "Delivery announcement",
    promotionId: "",
    status: "DRAFT",
    cpcMinor: 30,
    budgetMinor: 2000,
    spentMinor: 0,
    impressions: 0,
    clicks: 0,
    startDate: "",
  },
];

export const findCampaign = (id: string) =>
  CAMPAIGN_ITEMS.find((c) => c.id === id);

export const RECENT_CLICKS: RecentClick[] = [
  {
    id: "k1",
    time: "Today, 2:14 pm",
    source: "Discover",
    valid: true,
    chargedMinor: 50,
  },
  {
    id: "k2",
    time: "Today, 1:52 pm",
    source: "Deals",
    valid: true,
    chargedMinor: 50,
  },
  {
    id: "k3",
    time: "Today, 1:49 pm",
    source: "Deals",
    valid: false,
    chargedMinor: 0,
  },
  {
    id: "k4",
    time: "Today, 11:30 am",
    source: "Search",
    valid: true,
    chargedMinor: 50,
  },
  {
    id: "k5",
    time: "Yesterday, 6:05 pm",
    source: "Home",
    valid: true,
    chargedMinor: 50,
  },
  {
    id: "k6",
    time: "Yesterday, 4:41 pm",
    source: "Discover",
    valid: true,
    chargedMinor: 50,
  },
];
