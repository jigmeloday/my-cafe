import type { LucideIcon } from "lucide-react";

import type { ACCOUNT_TYPES } from "@/lib/constants";
import type {
  AddressInput,
  ContactInput,
  PersonalInfoInput,
  PreferencesInput,
} from "@/lib/validations/profile.schema";

export interface ProfileUser {
  email: string;
  accountType: (typeof ACCOUNT_TYPES)[number];
  joined: string;
  personal: PersonalInfoInput;
  contact: ContactInput;
  address: AddressInput;
  preferences: PreferencesInput;
}

export interface ProfileStat {
  label: string;
  value: number;
}

export interface ProfileNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface ProfileNavGroup {
  title: string;
  items: ProfileNavItem[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
}

export interface CompletionTask {
  id: string;
  label: string;
  href: string;
}

export interface CompletionItem extends CompletionTask {
  done: boolean;
}

export interface SummaryRow {
  label: string;
  value: string;
}

export interface OptionItem {
  value: string;
  label: string;
}

export interface SwitchOption {
  name: string;
  label: string;
  description: string;
}
