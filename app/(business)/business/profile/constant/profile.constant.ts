import type { ProfileTab } from "../model/profile.type";

export const PROFILE_COPY = {
  title: "Business profile",
  subtitle: "This is what people see on your public page.",
  viewPublic: "Preview public page",
  mediaNote:
    "Photos are previewed here. Saving them connects when file storage is set up.",
};

export const PROFILE_TABS: ProfileTab[] = [
  { id: "general", label: "General" },
  { id: "contact", label: "Contact & location" },
  { id: "hours", label: "Opening hours" },
  { id: "photos", label: "Photos" },
  { id: "offerings", label: "Services & products" },
  { id: "account", label: "Account" },
];

export const DESCRIPTION_MAX = 500;

export const CARD_COPY = {
  basics: {
    title: "Basic information",
    description: "Your name, a short tagline and a description.",
  },
  contact: {
    title: "Contact details",
    description: "How customers can reach you.",
  },
  location: { title: "Location", description: "Where people can find you." },
  social: { title: "Social links", description: "Optional. Paste full links." },
  hours: {
    title: "Opening hours",
    description: "Set the hours you are open each day.",
  },
  brand: {
    title: "Logo & cover",
    description: "Shown at the top of your public page.",
  },
  gallery: {
    title: "Gallery",
    description: "Show off your place, products or team.",
  },
  account: {
    title: "Password",
    description: "Change the password you use to log in.",
  },
  offerings: {
    title: "Services & products",
    description: "List what you offer so people can find you in search.",
  },
};
