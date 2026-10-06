import {
  Bell,
  Heart,
  LayoutDashboard,
  MapPin,
  ShieldCheck,
  SlidersHorizontal,
  UserCheck,
  UserRound,
} from "lucide-react";

import type {
  CompletionTask,
  ProfileNavGroup,
  ProfileStat,
  ProfileUser,
} from "../model/profile.type";

import { FOLLOWING_PLACES, SAVED_OFFERS } from "./profile.data";

export const PROFILE_USER: ProfileUser = {
  email: "you@example.com",
  accountType: "USER",
  joined: "Joined October 2026",
  personal: { name: "[Your name]", birthday: "", gender: "" },
  contact: { phone: "", preferredContact: "email" },
  address: {
    line1: "",
    line2: "",
    town: "",
    dzongkhag: "Thimphu",
    postalCode: "",
  },
  preferences: {
    channels: { email: true, sms: false, push: true },
    topics: {
      followed: true,
      weekend: true,
      newPlaces: false,
      ending: true,
      birthday: true,
    },
    allowPersonalisation: true,
    marketingConsent: false,
  },
};

export const PROFILE_STATS: ProfileStat[] = [
  { label: "Favorites", value: SAVED_OFFERS.length },
  { label: "Following", value: FOLLOWING_PLACES.length },
];

export const PROFILE_NAV: ProfileNavGroup[] = [
  {
    title: "Account",
    items: [
      { label: "Overview", href: "/profile", icon: LayoutDashboard },
      { label: "Personal info", href: "/profile/personal", icon: UserRound },
      { label: "Contact & address", href: "/profile/contact", icon: MapPin },
      {
        label: "Preferences",
        href: "/profile/preferences",
        icon: SlidersHorizontal,
      },
      { label: "Security", href: "/profile/security", icon: ShieldCheck },
    ],
  },
  {
    title: "Activity",
    items: [
      { label: "Favorites", href: "/profile/favorites", icon: Heart },
      { label: "Following", href: "/profile/following", icon: UserCheck },
      { label: "Notifications", href: "/profile/notifications", icon: Bell },
    ],
  },
];

export const ACCOUNT_TYPE_LABELS = {
  USER: "Customer account",
  BUSINESS_OWNER: "Business owner account",
} as const;

export const COMPLETION_TASKS: CompletionTask[] = [
  { id: "name", label: "Add your name", href: "/profile/personal" },
  { id: "birthday", label: "Add your birthday", href: "/profile/personal" },
  { id: "phone", label: "Add a phone number", href: "/profile/contact" },
  { id: "address", label: "Add your address", href: "/profile/contact" },
  {
    id: "interests",
    label: "Pick your interests",
    href: "/profile/preferences",
  },
  { id: "follow", label: "Follow 3 places", href: "/discover" },
];

export const FOLLOW_GOAL = 3;
export const NOT_SET = "Not set";

export const PROFILE_COPY = {
  personalTitle: "Personal info",
  personalDescription: "Used to personalise your account and birthday offers.",
  contactTitle: "Contact details",
  contactDescription:
    "How places and kuzu can reach you. Your email can't be changed here.",
  addressTitle: "Address",
  addressDescription: "Used to show offers and events near you.",
  channelsTitle: "How we reach you",
  channelsDescription: "Choose the channels you want updates on.",
  topicsTitle: "What you hear about",
  topicsDescription: "Pick the updates that matter to you.",
  privacyTitle: "Privacy",
  privacyDescription: "You're in control. Change these any time.",
  interestsTitle: "Interests",
  interestsDescription: "Choose what you like so we can show you more of it.",
  passwordTitle: "Password",
  passwordDescription: "Use a strong password you don't use anywhere else.",
  passwordSubmit: "Update password",
  dangerTitle: "Delete account",
  dangerDescription:
    "This permanently removes your profile, favorites and followed places.",
  dangerButton: "Delete my account",
  dialogTitle: "Delete your account?",
  dialogDescription:
    "This can't be undone. Your favorites and followed places will be lost.",
  dialogCancel: "Keep my account",
  dialogConfirm: "Delete account",
  savedTitle: "Favorites",
  savedDescription: "Offers, events and places you have saved.",
  savedEmptyTitle: "No favorites yet",
  savedEmptyDescription:
    "Tap the heart on any offer, event or place to keep it here.",
  followingTitle: "Following",
  followingDescription:
    "Places you follow. You will see their new offers first.",
  followingEmptyTitle: "You're not following anyone yet",
  followingEmptyDescription: "Follow places to see their new offers.",
  notificationsTitle: "Notifications",
  notificationsDescription: "Updates from the places you follow.",
  notificationsEmptyTitle: "No notifications yet",
  notificationsEmptyDescription:
    "New offers and events from places you follow show up here.",
};

export const OVERVIEW_COPY = {
  completionTitle: "Complete your profile",
  detailsTitle: "Your details",
  updatesTitle: "Latest updates",
  favoritesTitle: "Your favorites",
  followingTitle: "Following",
  recommendedTitle: "Picked for you",
  recommendedDescription: "Based on what you save and follow.",
  weekendTitle: "Happening this weekend",
  viewAll: "View all",
  edit: "Edit",
};
