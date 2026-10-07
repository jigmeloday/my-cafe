import { CONTACT_METHODS, GENDERS } from "@/lib/constants";

import type { OptionItem, SwitchOption } from "../model/profile.type";

const GENDER_LABELS: Record<(typeof GENDERS)[number], string> = {
  female: "Female",
  male: "Male",
  other: "Other",
  prefer_not_to_say: "Prefer not to say",
};

const CONTACT_LABELS: Record<(typeof CONTACT_METHODS)[number], string> = {
  email: "Email",
  phone: "Phone call or SMS",
  whatsapp: "WhatsApp",
};

export const GENDER_OPTIONS: OptionItem[] = GENDERS.map((value) => ({
  value,
  label: GENDER_LABELS[value],
}));

export const CONTACT_OPTIONS: OptionItem[] = CONTACT_METHODS.map((value) => ({
  value,
  label: CONTACT_LABELS[value],
}));

export const INTERESTS = [
  "Food & drink",
  "Cafés",
  "Fashion",
  "Electronics",
  "Wellness",
  "Stays",
  "Music",
  "Culture",
  "Kids",
  "Sports",
  "Books",
  "Crafts",
] as const;

export const CHANNEL_OPTIONS: SwitchOption[] = [
  {
    name: "channels.email",
    label: "Email",
    description: "Updates sent to your email address.",
  },
  {
    name: "channels.sms",
    label: "SMS",
    description: "Short text messages to your phone.",
  },
  {
    name: "channels.push",
    label: "In-app",
    description: "Notifications inside kuzu.",
  },
];

export const TOPIC_OPTIONS: SwitchOption[] = [
  {
    name: "topics.followed",
    label: "Places I follow",
    description: "New offers and events from places you follow.",
  },
  {
    name: "topics.weekend",
    label: "This weekend",
    description: "A Friday round-up of what's on.",
  },
  {
    name: "topics.newPlaces",
    label: "New places near me",
    description: "When something opens in your dzongkhag.",
  },
  {
    name: "topics.ending",
    label: "Offers ending soon",
    description: "A reminder before your favourites end.",
  },
  {
    name: "topics.birthday",
    label: "Birthday offers",
    description: "A treat from places you follow on your birthday.",
  },
];

export const PRIVACY_OPTIONS: SwitchOption[] = [
  {
    name: "allowPersonalisation",
    label: "Personalise with my details",
    description:
      "Use my birthday, address and interests to show relevant offers.",
  },
  {
    name: "marketingConsent",
    label: "Promotional messages",
    description: "Allow kuzu to send offers and news from partner businesses.",
  },
];
