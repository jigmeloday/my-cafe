import "server-only";

import { getCurrentUser } from "@/lib/session";
import { discoveryService } from "@/services/discovery/discovery.service";
import { businessService } from "@/services/business/business.service";

import { profileFromRecord } from "./business-record.utils";
import type { BusinessProfile } from "../model/business.type";

/** The business with this address, or null (also for a suspended one). */
export async function getBusinessProfile(slug: string): Promise<BusinessProfile | null> {
  const record = await businessService.findPublic(slug);
  if (!record) return null;
  const user = await getCurrentUser();
  const activity = await discoveryService.businessActivity(record.id);
  return { ...profileFromRecord(record), activity, isOwner: user?.id === record.ownerId };
}
