import type { CoinTransaction } from "../model/wallet.type";

// Sample history, newest first. Replaced by real wallet transactions once the database exists.
export const COIN_TRANSACTIONS: CoinTransaction[] = [
  {
    id: "t1",
    type: "EMAIL_CAMPAIGN",
    description: "Email: Tshechu kira offer (178 followers)",
    amount: -178,
    date: "2026-10-06T10:00",
  },
  {
    id: "t2b",
    type: "BANNER",
    description: "Homepage banner: 20% off hand-woven kira · 7 days",
    amount: -1400,
    date: "2026-10-05T16:30",
  },
  {
    id: "t2",
    type: "TOP_RANK",
    description: "Top ranking: 20% off hand-woven kira · 3 days",
    amount: -300,
    date: "2026-10-05T16:20",
  },
  {
    id: "t3",
    type: "PURCHASE",
    description: "Bought 1,000 coins",
    amount: 1000,
    date: "2026-10-04T11:05",
  },
  {
    id: "t4",
    type: "BANNER",
    description: "Homepage banner: Opening-week set menu · 3 days",
    amount: -600,
    date: "2026-10-01T09:40",
  },
  {
    id: "t5",
    type: "EMAIL_CAMPAIGN",
    description: "Email: Opening week menu (164 followers)",
    amount: -164,
    date: "2026-10-01T09:30",
  },
  {
    id: "t6",
    type: "REFUND",
    description: "Refund: cancelled campaign “Giveaway teaser”",
    amount: 85,
    date: "2026-09-28T14:10",
  },
  {
    id: "t7",
    type: "PURCHASE",
    description: "Bought 500 coins",
    amount: 500,
    date: "2026-09-25T10:15",
  },
];
