import type { OfferSectionData } from "../model/home.type";

export const OFFER_CARD_WIDTH =
  "w-[44%] shrink-0 snap-start sm:w-[30%] md:w-[22%] lg:w-[calc((100%-5rem)/6)]";

export const OFFER_SECTIONS: OfferSectionData[] = [
  {
    id: "popular",
    title: "Popular offers in Thimphu",
    href: "/deals",
    items: [
      {
        id: "p1",
        badge: "Popular",
        title: "Second pizza free on Fridays",
        meta: ["[Pizzeria] · Motithang", "Every Friday evening"],
        highlight: "Buy 1 get 1",
        href: "/promotions/pizza-fridays",
      },
      {
        id: "p2",
        title: "Hand-woven kira for Tshechu",
        meta: ["[Textile house] · Norzin Lam", "Until 20 Oct"],
        highlight: "20% off",
        href: "/promotions/kira",
      },
      {
        id: "p3",
        title: "Phone trade-in offer",
        meta: ["[Mobile shop] · Town centre", "Until 15 Oct"],
        highlight: "15% off",
        href: "/promotions/trade-in",
      },
      {
        id: "p4",
        badge: "Popular",
        title: "Hot stone bath package",
        meta: ["[Spa name] · Babesa", "Until 20 Oct"],
        highlight: "Free massage oil",
        href: "/promotions/hot-stone",
      },
      {
        id: "p5",
        title: "Fresh bread after 7 pm",
        meta: ["[Bakery name] · Chubachu", "Every day"],
        highlight: "Half price",
        href: "/promotions/bread",
      },
      {
        id: "p6",
        title: "Hiking boots & jackets",
        meta: ["[Sports store] · Olakha", "Until 12 Oct"],
        highlight: "30% off",
        href: "/promotions/hiking",
      },
    ],
  },
  {
    id: "new",
    title: "Just opened near you",
    href: "/discover",
    items: [
      {
        id: "n1",
        badge: "New",
        title: "[Restaurant name]",
        meta: ["Restaurant · Norzin Lam", "Opened this week"],
        highlight: "Opening-week menu",
        href: "/businesses/restaurant",
      },
      {
        id: "n2",
        badge: "New",
        title: "[Café name]",
        meta: ["Café · Changzamtog", "Opened 2 weeks ago"],
        highlight: "Free tasting",
        href: "/businesses/cafe",
      },
      {
        id: "n3",
        title: "[Boutique name]",
        meta: ["Clothing · Town centre", "Opened this month"],
        highlight: "New arrivals",
        href: "/businesses/boutique",
      },
      {
        id: "n4",
        title: "[Gym name]",
        meta: ["Fitness · Babesa", "Opened this month"],
        highlight: "First week free",
        href: "/businesses/gym",
      },
      {
        id: "n5",
        title: "[Bakery name]",
        meta: ["Bakery · Chubachu", "Opened this month"],
        highlight: "Fresh daily",
        href: "/businesses/bakery",
      },
      {
        id: "n6",
        title: "[Homestay name]",
        meta: ["Stay · Motithang", "Opened this month"],
        highlight: "Now open",
        href: "/businesses/homestay",
      },
    ],
  },
  {
    id: "events",
    title: "Happening soon",
    href: "/events",
    items: [
      {
        id: "e1",
        badge: "This weekend",
        title: "Festival night market",
        meta: ["[Venue] · Thimphu", "Sat 10 Oct · 5 pm"],
        highlight: "Free entry",
        href: "/events/night-market",
      },
      {
        id: "e2",
        title: "Live music evening",
        meta: ["[Venue] · Thimphu", "Mon 12 Oct · 7 pm"],
        highlight: "Nu. [PRICE]",
        href: "/events/live-music",
      },
      {
        id: "e3",
        title: "Archery open day",
        meta: ["[Venue] · Thimphu", "Sun 18 Oct · 9 am"],
        highlight: "Free entry",
        href: "/events/archery",
      },
      {
        id: "e4",
        title: "Crafts fair",
        meta: ["[Venue] · Thimphu", "Sun 25 Oct · All day"],
        highlight: "Free entry",
        href: "/events/crafts-fair",
      },
      {
        id: "e5",
        title: "Kids' painting workshop",
        meta: ["[Venue] · Thimphu", "Sat 31 Oct · 10 am"],
        highlight: "Nu. [PRICE]",
        href: "/events/painting",
      },
      {
        id: "e6",
        title: "Food festival",
        meta: ["[Venue] · Thimphu", "Sun 1 Nov · 11 am"],
        highlight: "Free entry",
        href: "/events/food-festival",
      },
    ],
  },
];
