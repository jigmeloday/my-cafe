import { Store, User } from "lucide-react";

import type { AccountTypeOption } from "../model/register.type";

export const ACCOUNT_TYPE_OPTIONS: AccountTypeOption[] = [
  {
    value: "USER",
    title: "I'm exploring",
    description:
      "Discover deals, events and new places. Save and follow your favourites.",
    icon: User,
  },
  {
    value: "BUSINESS_OWNER",
    title: "I own a business",
    description:
      "List your business, publish promotions and reach more people.",
    icon: Store,
  },
];

export const REGISTER_COPY = {
  title: "Welcome to kuzu",
  description: "Create an account to get started.",
  submit: "Create account",
  terms: "By creating an account you agree to our terms and privacy policy.",
  footerText: "Already have an account?",
  footerLink: { label: "Log in", href: "/login" },
  accountTypeLabel: "I am a…",
};
