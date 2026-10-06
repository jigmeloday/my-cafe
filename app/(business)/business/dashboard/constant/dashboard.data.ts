import type {
  CampaignRow,
  DailyPoint,
  PromotionRow,
} from "../model/dashboard.type";

// Sample data. Money is in integer minor units (cents).
export const DAILY_POINTS: DailyPoint[] = [
  { label: "19 Sep", impressions: 648, clicks: 18, spendMinor: 900 },
  { label: "20 Sep", impressions: 806, clicks: 22, spendMinor: 1100 },
  { label: "21 Sep", impressions: 712, clicks: 19, spendMinor: 950 },
  { label: "22 Sep", impressions: 972, clicks: 27, spendMinor: 1350 },
  { label: "23 Sep", impressions: 1130, clicks: 31, spendMinor: 1550 },
  { label: "24 Sep", impressions: 892, clicks: 24, spendMinor: 1200 },
  { label: "25 Sep", impressions: 720, clicks: 20, spendMinor: 1000 },
  { label: "26 Sep", impressions: 950, clicks: 26, spendMinor: 1300 },
  { label: "27 Sep", impressions: 1216, clicks: 33, spendMinor: 1650 },
  { label: "28 Sep", impressions: 1044, clicks: 29, spendMinor: 1450 },
  { label: "29 Sep", impressions: 1274, clicks: 35, spendMinor: 1750 },
  { label: "30 Sep", impressions: 1036, clicks: 28, spendMinor: 1400 },
  { label: "1 Oct", impressions: 1080, clicks: 30, spendMinor: 1500 },
  { label: "2 Oct", impressions: 1346, clicks: 37, spendMinor: 1850 },
];

export const WALLET = {
  balanceMinor: 12850,
  spentThisMonthMinor: 17100,
};

export const CAMPAIGNS: CampaignRow[] = [
  {
    id: "c1",
    name: "Tshechu weekend push",
    promotion: "20% off hand-woven kira",
    status: "ACTIVE",
    budgetMinor: 5000,
    spentMinor: 3350,
    cpcMinor: 50,
    impressions: 2410,
    clicks: 67,
  },
  {
    id: "c2",
    name: "Opening week menu",
    promotion: "Opening-week set menu",
    status: "ACTIVE",
    budgetMinor: 8000,
    spentMinor: 2150,
    cpcMinor: 40,
    impressions: 1520,
    clicks: 54,
  },
  {
    id: "c3",
    name: "Lunch deal",
    promotion: "Lunch set, two for one",
    status: "PAUSED",
    budgetMinor: 3000,
    spentMinor: 1200,
    cpcMinor: 40,
    impressions: 890,
    clicks: 30,
  },
  {
    id: "c4",
    name: "Winter coats",
    promotion: "Winter coats clearance",
    status: "SCHEDULED",
    budgetMinor: 4000,
    spentMinor: 0,
    cpcMinor: 50,
    impressions: 0,
    clicks: 0,
  },
  {
    id: "c5",
    name: "Summer sale",
    promotion: "Summer sale",
    status: "COMPLETED",
    budgetMinor: 5000,
    spentMinor: 5000,
    cpcMinor: 50,
    impressions: 3320,
    clicks: 100,
  },
];

export const PROMOTIONS: PromotionRow[] = [
  {
    id: "p1",
    title: "20% off hand-woven kira",
    type: "Sale",
    status: "Published",
    clicks: 67,
    boosted: true,
  },
  {
    id: "p2",
    title: "Opening-week set menu",
    type: "Deal",
    status: "Published",
    clicks: 54,
    boosted: true,
  },
  {
    id: "p3",
    title: "Festival night market stall",
    type: "Event",
    status: "Published",
    clicks: 21,
    boosted: false,
  },
  {
    id: "p4",
    title: "Free delivery in Thimphu",
    type: "Announcement",
    status: "Draft",
    clicks: 0,
    boosted: false,
  },
];
