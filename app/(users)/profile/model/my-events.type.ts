export interface MyEvent {
  id: string;
  promotionId: string;
  title: string;
  businessName: string;
  location: string;
  /** "YYYY-MM-DD": the day it starts, or the last day if it has no start. Empty when the event has no date. */
  when: string;
  href: string;
  /** The event has finished (or was taken down), so it can no longer be cancelled. */
  over: boolean;
}
