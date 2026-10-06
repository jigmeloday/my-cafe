import {
  COMPLETION_TASKS,
  FOLLOW_GOAL,
  NOT_SET,
} from "../constant/profile.constant";
import type {
  CompletionItem,
  ProfileUser,
  SummaryRow,
} from "../model/profile.type";

export const getInitials = (name: string): string =>
  name
    .replace(/[\[\]]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export function formatBirthday(value: string): string {
  if (!value) return NOT_SET;
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatAddress({
  line1,
  line2,
  town,
  dzongkhag,
  postalCode,
}: ProfileUser["address"]): string {
  const parts = [line1, line2, town, dzongkhag, postalCode].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : NOT_SET;
}

export function getSummary(user: ProfileUser): SummaryRow[] {
  return [
    { label: "Name", value: user.personal.name },
    { label: "Birthday", value: formatBirthday(user.personal.birthday) },
    { label: "Email", value: user.email },
    { label: "Phone", value: user.contact.phone || NOT_SET },
    { label: "Address", value: formatAddress(user.address) },
  ];
}

interface CompletionInput {
  user: ProfileUser;
  interestCount: number;
  followingCount: number;
}

export function getCompletion({
  user,
  interestCount,
  followingCount,
}: CompletionInput) {
  const done: Record<string, boolean> = {
    name: !user.personal.name.startsWith("["),
    birthday: Boolean(user.personal.birthday),
    phone: Boolean(user.contact.phone),
    address: Boolean(user.address.line1 && user.address.town),
    interests: interestCount > 0,
    follow: followingCount >= FOLLOW_GOAL,
  };
  const items: CompletionItem[] = COMPLETION_TASKS.map((t) => ({
    ...t,
    done: done[t.id],
  }));
  const percent = Math.round(
    (items.filter((i) => i.done).length / items.length) * 100,
  );
  return { items, percent };
}
