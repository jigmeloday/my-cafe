export const INSIGHT_METRICS = [{ id: "reservations", label: "Seats reserved", kind: "number" as const }];

export const REGISTRATIONS_COPY = {
  pageViews: "Page views",
  viewsHint: "people who opened your event",
  viewsToSeats: "Reserved a seat",
  viewsToSeatsHint: "of the people who opened it",
  perDayTitle: "Seats reserved each day",
  title: "Guest lists",
  subtitle: "Who has reserved a seat at your events. Turn on seat reservations when you create or edit an event.",
  emptyTitle: "No events are taking reservations yet",
  emptyDescription: "Create an event and switch on \"Let people reserve a seat\". Everyone who reserves will show here.",
  emptyAction: "Create an event",
  back: "Guest lists",
  registered: "Coming",
  seatsLeft: "Seats left",
  unlimited: "No limit",
  download: "Download guest list (CSV)",
  noOne: "Nobody has reserved a seat yet.",
  noOneHint: "Share your event to get people signing up.",
  privacy: (days: number) => `Names and phone numbers are shared with you by the people who registered. Please use them only for this event. They are removed ${days} days after the event ends, so download the list before then if you need it.`,
  closed: "Registration is off",
};

/** Shown where a name was removed after the event. */
export const REMOVED_NAME = "Removed after the event";

export const ATTENDEE_HEADERS = ["#", "Name", "Phone", "Registered"];
