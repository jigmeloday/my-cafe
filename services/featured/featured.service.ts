import { FEATURED_HORIZON_DAYS, remainingByDay } from "@/lib/featured";
import { featuredRepository } from "@/server/repositories/featured.repository";
import { promotionRepository } from "@/server/repositories/promotion.repository";
import { bhutanToday } from "@/services/discovery/discovery.service";

export interface OwnBooking {
  start: string;
  end: string;
  coins: number;
}

const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (isoDate: string, days: number) => iso(new Date(Date.parse(`${isoDate}T00:00:00Z`) + days * 86_400_000));

export const featuredService = {
  /**
   * Places left on each of the next days, so the form can show which days are open. It is only a guide:
   * the real check happens, under a lock, when the booking is saved.
   */
  async availability(now = new Date()): Promise<Record<string, number>> {
    const today = iso(bhutanToday(now));
    const last = addDays(today, FEATURED_HORIZON_DAYS - 1);
    return remainingByDay(today, FEATURED_HORIZON_DAYS, await featuredRepository.bookedRanges(today, last));
  },

  /** Bookings the owner has made for one of their promotions. */
  async forPromotion(ownerId: string, promotionId: string): Promise<OwnBooking[]> {
    if (!(await promotionRepository.findOwned(promotionId, ownerId))) return [];
    return (await featuredRepository.forPromotion(promotionId)).map((b) => ({ start: iso(b.startsAt), end: iso(b.endsAt), coins: b.coins }));
  },
};
