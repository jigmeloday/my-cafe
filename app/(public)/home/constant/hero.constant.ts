import type { HeroSlideData } from "../model/home.type";

export const HERO_SLIDES: HeroSlideData[] = [
  {
    id: "grand-opening",
    eyebrow: "Grand opening",
    title: "[Restaurant name] is now open",
    description:
      "Fresh [cuisine] on Norzin Lam — opening-week set menu, lunch and dinner daily.",
    cta: "See the menu",
    href: "/businesses",
    sponsored: true,
    imageLabel: "Banner photo: restaurant grand opening",
  },
  {
    id: "tshechu-sale",
    eyebrow: "Tshechu sale",
    title: "Dress up for the festival",
    description: "[Textile house] — 20% off hand-woven kira until 20 October.",
    cta: "Shop the sale",
    href: "/promotions/kira",
    sponsored: true,
    imageLabel: "Banner photo: festival wear",
  },
  {
    id: "weekend-market",
    eyebrow: "This weekend",
    title: "Festival night market",
    description: "Food, crafts and live music in the town centre. Free entry.",
    cta: "See the event",
    href: "/events",
    imageLabel: "Banner photo: night market",
  },
  {
    id: "new-cafe",
    eyebrow: "New cafe",
    title: "Specialty coffee in Changzamtog",
    description:
      "Opening-week tasting flights and a free pastry with every order.",
    cta: "View offer",
    href: "/discover",
    imageLabel: "Banner photo: new cafe",
  },
];

export const CTA_BANNER = {
  title: "Have something new to share? Put it on kuzu.",
  description:
    "List your opening, offer or event for free. Promote it with a banner when you want more people to see it — you set the budget and pay per click.",
  cta: "Get started",
  href: "/business",
  imageLabel: "Photo: local shop owner",
};
