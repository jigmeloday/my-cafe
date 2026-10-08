import type { USER_ROLES, USER_STATUSES } from "@/lib/constants";

export type UserRole = (typeof USER_ROLES)[number];
export type UserStatus = (typeof USER_STATUSES)[number];

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  /** "YYYY-MM-DD" */
  joined: string;
  /** "YYYY-MM-DDTHH:mm" */
  lastActive: string;
}

export type UserFilter = "ALL" | UserRole | "SUSPENDED";

export interface UserFilters {
  query: string;
  filter: UserFilter;
}
