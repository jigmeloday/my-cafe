import type { BUSINESS_STATUSES } from "@/lib/constants";

export type BusinessStatus = (typeof BUSINESS_STATUSES)[number];

export interface AdminBusiness {
  id: string;
  name: string;
  /** Public page: /businesses/{slug} */
  slug: string;
  ownerName: string;
  ownerEmail: string;
  category: string;
  dzongkhag: string;
  status: BusinessStatus;
  promotions: number;
  followers: number;
  /** "YYYY-MM-DD" */
  joined: string;
}

export interface BusinessFilters {
  query: string;
  status: BusinessStatus | "ALL";
}
