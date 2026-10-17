import type { USER_ROLES, USER_STATUSES } from "@/lib/constants";

export type UserRole = (typeof USER_ROLES)[number];
export type UserStatus = (typeof USER_STATUSES)[number];

/** Which group of users to show. "SUSPENDED" is by status, the others are by role. */
export type UserFilter = "ALL" | UserRole | "SUSPENDED";

export interface UserListQuery {
  /** Searches name and email. */
  q: string;
  filter: UserFilter;
  page: number;
}

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  /** Whether they have confirmed this email address belongs to them. */
  emailVerified: boolean;
  /** Their phone number as saved (e.g. "+97517123456"), or "" if they haven't added one. */
  phone: string;
  /** "YYYY-MM-DD" */
  joined: string;
  /** "YYYY-MM-DD": the last time they signed in or used a session. */
  lastActive: string;
}

export interface UserListResult {
  items: AdminUserRow[];
  /** Users matching the search and filter, across all pages. */
  total: number;
  /** The page actually returned (a page past the end is pulled back to the last one). */
  page: number;
  pageSize: number;
  totalPages: number;
  /** How many users are in each group, ignoring the search. For the filter chips. */
  counts: Record<UserFilter, number>;
}
