import { cache } from "react";

import { getCurrentUser } from "@/lib/session";
import { businessRepository } from "@/server/repositories/business.repository";

/** Name and page address of the signed-in owner's business, for the dashboard header. Null for anyone else. */
export const getOwnBusiness = cache(async () => {
  const user = await getCurrentUser();
  if (!user || user.role !== "BUSINESS_OWNER") return null;
  const business = await businessRepository.findByOwner(user.id);
  return business ? { name: business.name, slug: business.slug } : null;
});
