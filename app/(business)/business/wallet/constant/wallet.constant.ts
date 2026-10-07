import { Mail, PanelTop, TrendingUp } from "lucide-react";

import type { StatusTone } from "@/components/shared/status-badge";
import { COIN_COSTS } from "@/lib/coins";

import type { CoinTransactionType } from "../model/wallet.type";

export const TRANSACTION_TYPE: Record<
  CoinTransactionType,
  { label: string; tone: StatusTone }
> = {
  PURCHASE: { label: "Purchase", tone: "success" },
  EMAIL_CAMPAIGN: { label: "Email", tone: "info" },
  BANNER: { label: "Banner", tone: "info" },
  TOP_RANK: { label: "Top ranking", tone: "info" },
  REFUND: { label: "Refund", tone: "neutral" },
};

export const COIN_USES = [
  {
    id: "email",
    icon: Mail,
    title: "Email your followers",
    description: "Tell the people who follow you about a new promotion.",
    price: `${COIN_COSTS.emailPerRecipient} coin per follower`,
  },
  {
    id: "banner",
    icon: PanelTop,
    title: "Homepage banner",
    description: "Show a promotion in the big banner on the homepage.",
    price: `${COIN_COSTS.bannerPerDay} coins per day`,
  },
  {
    id: "rank",
    icon: TrendingUp,
    title: "Rank at the top",
    description: "Appear first in Deals, Events and New places.",
    price: `${COIN_COSTS.topRankPerDay} coins per day`,
  },
];

export const LOW_BALANCE = 100;
export const RECENT_COUNT = 5;

export const WALLET_COPY = {
  title: "Wallet",
  subtitle: "Coins are prepaid credits you spend to reach more people.",
  balance: "Your balance",
  lowBalance:
    "Your balance is low. Top up so your emails and placements aren't interrupted.",
  buyTitle: "Buy coins",
  buyHint: "Bigger amounts cost less per coin.",
  customTitle: "Or choose your own amount",
  customHint: "You pay the same per coin as the packs.",
  buy: "Buy",
  best: "Best value",
  usesTitle: "What coins are for",
  recentTitle: "Recent activity",
  viewAll: "View all",
  noActivity: "No activity yet.",
};
