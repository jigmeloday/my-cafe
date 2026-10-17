import "server-only";

import { getCurrentUser } from "@/lib/session";
import { businessService } from "@/services/business/business.service";

import { profileFromRecord } from "./business-record.utils";
import { getSampleProfile } from "./business.utils";
import type { BusinessProfile } from "../model/business.type";

/** A real business if one has this address, otherwise one of the sample places. */
export async function getBusinessProfile(slug: string): Promise<BusinessProfile | null> {
  const record = await businessService.findPublic(slug);
  if (!record) return getSampleProfile(slug);
  const user = await getCurrentUser();
  return { ...profileFromRecord(record), isOwner: user?.id === record.ownerId };
}
