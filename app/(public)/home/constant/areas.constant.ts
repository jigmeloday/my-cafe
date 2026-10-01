import type { AreaItem } from "../model/home.type";

export const AREA_TABS = [
  "Thimphu",
  "Paro",
  "Punakha",
  "Phuentsholing",
] as const;

export const AREAS: Record<(typeof AREA_TABS)[number], AreaItem[]> = {
  Thimphu: [
    { name: "Norzin Lam", description: "Shops & restaurants" },
    { name: "Changzamtog", description: "Cafés & bakeries" },
    { name: "Motithang", description: "Dining & stays" },
    { name: "Olakha", description: "Sports & furniture" },
    { name: "Babesa", description: "Wellness & fitness" },
    { name: "Chubachu", description: "Bakeries & groceries" },
    { name: "Clock Tower", description: "Books & events" },
    { name: "Town centre", description: "Phones & fashion" },
    { name: "Kawajangsa", description: "Crafts & culture" },
    { name: "Dechencholing", description: "Local shops" },
    { name: "Taba", description: "Homestays" },
    { name: "Debsi", description: "Services" },
  ],
  Paro: [
    { name: "Paro town", description: "Shops & cafés" },
    { name: "Airport road", description: "Stays & dining" },
    { name: "Bondey", description: "Crafts & local shops" },
  ],
  Punakha: [
    { name: "Khuruthang", description: "Shops & dining" },
    { name: "Lobesa", description: "Homestays & farms" },
  ],
  Phuentsholing: [
    { name: "Main market", description: "Shops & electronics" },
    { name: "Toorsa Road", description: "Food & stays" },
  ],
};
