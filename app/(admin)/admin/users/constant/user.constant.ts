import type { StatusTone } from "@/components/shared/status-badge";

import type {
  UserFilter,
  UserRole,
  UserStatus,
} from "../model/user.type";

export const ROLE_LABELS: Record<UserRole, string> = {
  USER: "Customer",
  BUSINESS_OWNER: "Business owner",
  ADMIN: "Admin",
};

export const ROLE_TONES: Record<UserRole, StatusTone> = {
  USER: "neutral",
  BUSINESS_OWNER: "info",
  ADMIN: "warning",
};

/** Whether the person has confirmed their email address. */
export const EMAIL_STATUS = {
  verified: { label: "Verified", tone: "success" },
  unverified: { label: "Not verified", tone: "warning" },
} as const satisfies Record<string, { label: string; tone: StatusTone }>;

export const USER_STATUS: Record<
  UserStatus,
  { label: string; tone: StatusTone }
> = {
  ACTIVE: { label: "Active", tone: "success" },
  SUSPENDED: { label: "Suspended", tone: "danger" },
};

export const FILTERS: { id: UserFilter; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "USER", label: "Customers" },
  { id: "BUSINESS_OWNER", label: "Business owners" },
  { id: "ADMIN", label: "Admins" },
  { id: "SUSPENDED", label: "Suspended" },
];

/** How long to wait after the last keystroke before searching. */
export const SEARCH_DELAY_MS = 400;

export const USERS_COPY = {
  title: "Users",
  subtitle: "Everyone with a Nook account.",
  searchPlaceholder: "Search by name, email or phone",
  searchHint: "Try several words, e.g. \"wangmo pema\", or a phone number.",
  emptyTitle: "No users match",
  emptyDescription: "Try a different search or filter.",
  adminNote: "Admins can't be changed here.",
  selfNote: "You",
};
