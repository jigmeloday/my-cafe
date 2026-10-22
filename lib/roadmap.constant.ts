import { Bell, CreditCard, Mail, Smartphone } from "lucide-react";

import type { RoadmapAudience, RoadmapItem, RoadmapStatus } from "@/types/roadmap";

/**
 * Features that are on the way, shown on the Coming soon page, the About page and the business dashboard.
 * Edit this list to add, remove or change one: nothing else needs to change. Keep to what is really planned.
 */
export const ROADMAP: RoadmapItem[] = [
  {
    id: "pay-online",
    audience: "businesses",
    status: "soon",
    icon: CreditCard,
    title: "Buy coins online",
    text: "Pay for coins right in your wallet. Until then, our support team adds them for you: just get in touch.",
  },
  {
    id: "email-followers",
    audience: "businesses",
    status: "planned",
    icon: Mail,
    title: "Email your followers",
    text: "Tell the people who follow you about a new deal or event, with a clear price in coins and easy unsubscribe.",
  },
  {
    id: "follow-alerts",
    audience: "customers",
    status: "planned",
    icon: Bell,
    title: "Alerts from places you follow",
    text: "Hear when a place you follow posts a new deal or event, so you never miss what's next.",
  },
  {
    id: "alert-channels",
    audience: "customers",
    status: "planned",
    icon: Smartphone,
    title: "Choose how we reach you",
    text: "Get alerts by email, SMS or app notification, whichever suits you, and switch them off any time.",
  },
];

export const ROADMAP_STATUS: Record<RoadmapStatus, { label: string; tone: "info" | "neutral" }> = {
  soon: { label: "Coming soon", tone: "info" },
  planned: { label: "Planned", tone: "neutral" },
};

export const ROADMAP_AUDIENCES: Record<RoadmapAudience, { title: string; text: string }> = {
  customers: { title: "For people looking around", text: "Easier ways to find things and never miss them." },
  businesses: { title: "For businesses", text: "More ways to reach people and run your page." },
};

export const ROADMAP_COPY = {
  title: "What's coming to Nook",
  lead: "We're building Nook step by step, with local businesses and the people who use it. Here's what's on the way. Dates can change, so we show how close each one is.",
  page: "/coming-soon",
  seeAll: "See everything that's coming",
  nextTitle: "Coming next",
  feedbackTitle: "Got an idea?",
  feedbackText: "Tell us what would help you most. We read every message.",
  feedbackAction: "Contact us",
};
