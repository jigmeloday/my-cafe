import type { LucideIcon } from "lucide-react";

import type { ACCOUNT_TYPES } from "@/lib/constants";

export interface AccountTypeOption {
  value: (typeof ACCOUNT_TYPES)[number];
  title: string;
  description: string;
  icon: LucideIcon;
}
