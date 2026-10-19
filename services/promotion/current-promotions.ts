import { requireRole } from "@/lib/session";
import { promotionService } from "@/services/promotion/promotion.service";

/** The signed-in business owner's promotions. */
export async function getCurrentPromotions() {
  const user = await requireRole("BUSINESS_OWNER");
  return promotionService.list(user.id);
}
