import { BadgeCheck, CalendarDays, Flag, Heart, Megaphone, Search, Store, TrendingUp, type LucideIcon } from "lucide-react";

export interface AboutStep {
  icon: LucideIcon;
  title: string;
  text: string;
}

export const ABOUT_COPY = {
  title: "Find what's on in Bhutan",
  lead: "Nook is where people discover deals, events and new places near them, and where local businesses tell them about it.",
  story: [
    "Good things happen every day in Thimphu, Paro, Punakha and beyond: a new café opens, a weaver has a sale, a festival is coming. Most of it is shared on notice boards and by word of mouth, so a lot of people miss it.",
    "Nook puts it all in one place. People can look around, save what they like and follow the places they care about. Businesses of every size can reach them, for free to start with.",
  ],
  customersTitle: "For people looking around",
  customers: [
    { icon: Search, title: "Look around", text: "Browse deals, events and new places, or search by what, where and when." },
    { icon: Heart, title: "Save and follow", text: "Save promotions you like and follow places, so you don't miss what's next." },
    { icon: CalendarDays, title: "Go and enjoy", text: "Check the details, then visit. Nook is for discovery: deals are made with the business directly." },
  ] satisfies AboutStep[],
  businessesTitle: "For businesses",
  businesses: [
    { icon: Store, title: "Set up your page", text: "Add your hours, contact details, photos and what you offer." },
    { icon: Megaphone, title: "Post what's happening", text: "Publish deals and events. Want more eyes? Feature a promotion or run a homepage banner with coins." },
    { icon: TrendingUp, title: "See how it goes", text: "Your dashboard shows views, clicks, saves and who follows you, as totals." },
  ] satisfies AboutStep[],
  trustTitle: "Keeping it trustworthy",
  trust: [
    { icon: BadgeCheck, title: "Verified businesses", text: "Businesses can send their ID and trade licence to be checked. Verified ones show a badge. The documents stay private and only our review team can open them." },
    { icon: Flag, title: "Report anything wrong", text: "Anyone with an account can report a misleading or unsafe ad. We review every report and can warn the business or take the ad down." },
  ] satisfies AboutStep[],
  stand: [
    "Fair to everyone. Paid places are limited and shown in a random order, so a small shop gets the same chance as a big one.",
    "Your information is yours. We don't sell it, and businesses only see totals, never who you are.",
    "Plain and simple. No hidden fees: you see the price in coins before you pay.",
  ],
  statsTitle: "Nook today",
  ctaTitle: "Come and have a look",
  contactTitle: "Get in touch",
};
