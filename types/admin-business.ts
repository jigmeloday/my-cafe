export type BusinessStatus = "PENDING" | "VERIFIED" | "SUSPENDED";

/** Which group of businesses to show. */
export type BusinessFilter = "ALL" | BusinessStatus;

export interface BusinessListQuery {
  /** Searches the business name, its owner's name and email, and its town. */
  q: string;
  filter: BusinessFilter;
  page: number;
}

/** Where a business's identity check stands. */
export type VerificationState = "NONE" | "WAITING" | "SENT_BACK" | "APPROVED";

export interface AdminBusinessRow {
  id: string;
  name: string;
  /** Public page: /businesses/{slug} */
  slug: string;
  ownerName: string;
  ownerEmail: string;
  town: string;
  dzongkhag: string;
  status: BusinessStatus;
  /** Promotions visitors can see right now. */
  livePromotions: number;
  followers: number;
  verification: VerificationState;
  /** The waiting verification request, so the admin can go straight to it. */
  waitingRequestId: string | null;
  /** "YYYY-MM-DD" */
  joined: string;
}

export interface BusinessListResult {
  items: AdminBusinessRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  /** How many businesses are in each group, ignoring the search. For the filter chips. */
  counts: Record<BusinessFilter, number>;
}
