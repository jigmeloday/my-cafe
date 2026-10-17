export interface DaySeries {
  /** "5 Oct" */
  label: string;
  users: number;
  businesses: number;
  coins: number;
  /** Integer minor units. */
  revenueMinor: number;
}

export interface AttentionItem {
  id: string;
  label: string;
  count: number;
  href: string;
}
