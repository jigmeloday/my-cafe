import { BadgeCheck, CalendarDays, Coins, Flag, Heart, Lock, MapPin, Megaphone, MessageCircle, Scale, Search, Sparkles, Store, Tag, TrendingUp } from "lucide-react";

import type { AboutPillar, AboutStep } from "../model/about.type";

export const ABOUT_COPY = {
  eyebrow: "About Nook",
  title: "Everything happening in Bhutan, in one place.",
  lead: "Nook is Bhutan's discovery portal. People find deals, events and new places near them. Local businesses get a simple, fair way to be found.",
  browse: "Browse what's on",
  list: "List your business",
  note: "Free to browse. Free to start listing.",

  pillarsTitle: "What you'll find on Nook",
  pillars: [
    { icon: Tag, title: "Deals", text: "Offers and sales from local shops, cafés and services, with the dates and details up front.", href: "/deals", cta: "See deals" },
    { icon: CalendarDays, title: "Events", text: "Festivals, workshops, launches and nights out, soonest first, so you can plan.", href: "/events", cta: "See events" },
    { icon: MapPin, title: "New places", text: "Businesses that have just opened, so you hear about them first, not last.", href: "/discover", cta: "Find new places" },
  ] satisfies AboutPillar[],

  whyTitle: "Why Nook exists",
  whyLead: "Good things happen every day in Thimphu, Paro, Punakha and beyond. Too many people miss them.",
  before: {
    title: "Without Nook",
    points: ["Offers you only hear about after they've ended", "Notice boards, word of mouth and a dozen social pages", "Small shops with no way to be seen", "No quick way to know what's on this weekend"],
  },
  after: {
    title: "With Nook",
    points: ["One place for what's on near you", "Search by what, where and when", "Save it, follow the place, never miss the next one", "A free page for every business, whatever its size"],
  },

  howTitle: "How it works",
  customersTitle: "If you're looking around",
  customers: [
    { icon: Search, title: "Look around", text: "Browse deals, events and new places, or search by what, where and when." },
    { icon: Heart, title: "Save and follow", text: "Save promotions you like and follow the places you care about." },
    { icon: CalendarDays, title: "Go and enjoy", text: "Check the details, share it with friends, then visit. Deals are made directly with the business." },
  ] satisfies AboutStep[],
  businessesTitle: "If you run a business",
  businesses: [
    { icon: Store, title: "Set up your page", text: "Add your hours, contact details, photos, map link and what you offer." },
    { icon: Megaphone, title: "Post deals and events", text: "Publish in minutes. Customers can call, visit your website or chat with you on WhatsApp right from a promotion." },
    { icon: Sparkles, title: "Get seen", text: "Feature a promotion or run a home page banner with coins. Paid places are shown in a random order, so a small shop has the same chance as a big one." },
    { icon: TrendingUp, title: "See what works", text: "Your dashboard shows views, clicks, shares, WhatsApp chats and followers, as totals." },
  ] satisfies AboutStep[],

  trustTitle: "Built to be trusted",
  trust: [
    { icon: BadgeCheck, title: "Verified businesses", text: "Businesses can send their ID and trade licence to be checked. Verified ones show a badge. The documents stay private and only our review team can open them." },
    { icon: Flag, title: "Report anything wrong", text: "Anyone with an account can report a misleading or unsafe ad. We review every report and can warn the business or take the ad down." },
    { icon: Scale, title: "Fair to everyone", text: "Paid places are limited and shown in a random order. No business can buy its way to always being first." },
    { icon: Lock, title: "Your information is yours", text: "We don't sell it. Businesses only see totals, never who you are, unless you choose to reserve a seat at their event: then the organiser sees the name and phone you agreed to share." },
    { icon: Coins, title: "No hidden fees", text: "You see the price in coins before you pay for anything." },
    { icon: MessageCircle, title: "A real team", text: "Questions, ideas or problems? Write to us and a person replies." },
  ] satisfies AboutStep[],
  trustNote: "Read the details in our",

  ctaTitle: "Come and have a look",
  ctaPeople: { title: "Looking for something to do?", text: "See what's on near you today.", browse: "Browse deals", events: "See events" },
  ctaBusiness: { title: "Run a business in Bhutan?", text: "Put it in front of the people who are looking.", action: "List your business" },

  contactTitle: "Get in touch",
};
