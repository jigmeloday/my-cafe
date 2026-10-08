import type { StatusTone } from "@/components/shared/status-badge";

import type {
  UserFilter,
  UserFilters,
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

export const DEFAULT_FILTERS: UserFilters = { query: "", filter: "ALL" };

export const USERS_COPY = {
  title: "Users",
  subtitle: "Everyone with a kuzu account.",
  sampleNote: "Sample data.",
  searchPlaceholder: "Search by name or email",
  emptyTitle: "No users match",
  emptyDescription: "Try a different search or filter.",
  adminNote: "Admins can't be suspended here.",
};
