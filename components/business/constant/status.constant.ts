import type { StatusTone } from "@/components/shared/status-badge";
import type { CAMPAIGN_STATUSES } from "@/lib/constants";

export const CAMPAIGN_STATUS: Record<
  (typeof CAMPAIGN_STATUSES)[number],
  { label: string; tone: StatusTone }
> = {
  DRAFT: { label: "Draft", tone: "neutral" },
  SCHEDULED: { label: "Scheduled", tone: "info" },
  ACTIVE: { label: "Active", tone: "success" },
  PAUSED: { label: "Paused", tone: "warning" },
  COMPLETED: { label: "Completed", tone: "neutral" },
  CANCELLED: { label: "Cancelled", tone: "danger" },
};
