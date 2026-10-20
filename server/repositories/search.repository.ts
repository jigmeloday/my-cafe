import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

import { livePromotionWhere } from "./discovery.repository";

const promoInclude = {
  business: { select: { id: true, name: true, slug: true, town: true, dzongkhag: true, logoKey: true, hours: true, phone: true, website: true, addressLine1: true, addressLine2: true, postalCode: true, status: true } },
  category: { select: { name: true } },
} satisfies Prisma.PromotionInclude;

/** Words and a place, already made safe for a "contains" search (see lib/search.ts). */
export interface TextQuery {
  /** Every word must match somewhere. */
  words: string[];
  /** A place name: matches the town, area, address or the promotion's own location. */
  where: string;
}

export const searchRepository = {
  promotions: (today: Date, { words, where }: TextQuery, take: number) =>
    db.promotion.findMany({
      where: {
        AND: [
          livePromotionWhere(today),
          // Offers that haven't started yet aren't shown, except events (people look for what's coming).
          { OR: [{ type: "EVENT" }, { startsAt: null }, { startsAt: { lte: today } }] },
          ...words.map((w) => ({
            OR: [
              { title: { contains: w, mode: "insensitive" as const } },
              { description: { contains: w, mode: "insensitive" as const } },
              { discount: { contains: w, mode: "insensitive" as const } },
              { category: { is: { name: { contains: w, mode: "insensitive" as const } } } },
              { business: { is: { name: { contains: w, mode: "insensitive" as const } } } },
            ],
          })),
          ...(where
            ? [
                {
                  OR: [
                    { location: { contains: where, mode: "insensitive" as const } },
                    { business: { is: { town: { contains: where, mode: "insensitive" as const } } } },
                    { business: { is: { dzongkhag: { contains: where, mode: "insensitive" as const } } } },
                    { business: { is: { addressLine1: { contains: where, mode: "insensitive" as const } } } },
                  ],
                },
              ]
            : []),
        ],
      },
      include: promoInclude,
      orderBy: [{ createdAt: "desc" }],
      take,
    }),

  businesses: ({ words, where }: TextQuery, take: number) =>
    db.business.findMany({
      where: {
        AND: [
          { status: { not: "SUSPENDED" }, owner: { status: "ACTIVE" } },
          ...words.map((w) => ({
            OR: [
              { name: { contains: w, mode: "insensitive" as const } },
              { tagline: { contains: w, mode: "insensitive" as const } },
              { description: { contains: w, mode: "insensitive" as const } },
              { town: { contains: w, mode: "insensitive" as const } },
              { promotions: { some: { status: "PUBLISHED" as const, removedAt: null, title: { contains: w, mode: "insensitive" as const } } } },
            ],
          })),
          ...(where
            ? [
                {
                  OR: [
                    { town: { contains: where, mode: "insensitive" as const } },
                    { dzongkhag: { contains: where, mode: "insensitive" as const } },
                    { addressLine1: { contains: where, mode: "insensitive" as const } },
                  ],
                },
              ]
            : []),
        ],
      },
      orderBy: { createdAt: "desc" },
      take,
      select: {
        id: true, name: true, slug: true, tagline: true, town: true, dzongkhag: true, logoKey: true, coverKey: true, createdAt: true,
        promotions: { where: { status: "PUBLISHED" }, select: { category: { select: { name: true } } } },
      },
    }),
};
