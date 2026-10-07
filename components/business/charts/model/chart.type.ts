/** How a metric's numbers are shown. Plain data, so a server page can pass it to the client chart. */
/** "permille" values are whole-number tenths of a percent (528 = 52.8%). */
export type MetricKind = "number" | "money" | "coins" | "permille";

export interface ChartMetric {
  id: string;
  label: string;
  kind: MetricKind;
}

export interface ChartPoint {
  label: string;
  values: Record<string, number>;
}

export interface BarItem {
  id: string;
  label: string;
  value: number;
}
