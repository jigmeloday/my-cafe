import { cache } from "react";

import { requireRole } from "@/lib/session";
import { businessService } from "@/services/business/business.service";

/** The signed-in business owner's profile. Loaded once per request. */
export const getCurrentBusiness = cache(async () => {
  const user = await requireRole("BUSINESS_OWNER");
  return businessService.get(user);
});
