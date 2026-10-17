import { EVENTS } from "../../../(public)/events/constant/events.data";

export const WEEKEND_EVENTS = EVENTS.filter((e) =>
  e.tags.includes("weekend"),
).slice(0, 4);
