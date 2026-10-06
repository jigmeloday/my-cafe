import type { BusinessProfileData } from "../model/profile.type";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Sample data: replaced by the saved business once the database exists.
export const BUSINESS_PROFILE: BusinessProfileData = {
  general: {
    name: "[Business name]",
    tagline: "",
    description: "",
    categories: [],
  },
  contact: { phone: "", email: "owner@example.com", website: "" },
  location: {
    line1: "",
    line2: "",
    town: "",
    dzongkhag: "Thimphu",
    postalCode: "",
  },
  social: { facebook: "", instagram: "", tiktok: "" },
  hours: {
    hours: DAYS.map((day, i) => ({
      day,
      closed: i === 6,
      open: i === 5 ? "10:00" : "09:00",
      close: i === 5 ? "20:00" : "18:00",
    })),
  },
  offerings: { services: [], products: [] },
};
