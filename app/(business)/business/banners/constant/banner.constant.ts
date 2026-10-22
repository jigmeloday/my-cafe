import type { StatusTone } from "@/components/shared/status-badge";
import { COIN_COSTS } from "@/lib/coins";
import { BANNER_DAYS } from "@/lib/validations/banner.schema";

import type { BannerStatus } from "@/services/banner/banner.service";

export const BANNERS_COPY = {
  title: "Banners",
  subtitle: "A banner puts your image at the top of the home page for a few days. You pay in coins when you create it.",
  create: "Create banner",
  newTitle: "Create a banner",
  newSubtitle: "Add an image and a headline, choose where it leads and how long it runs.",
  back: "Banners",
  emptyTitle: "No banners yet",
  emptyDescription: "Create your first banner to be seen by everyone who opens Nook.",
  submit: "Pay & create banner",
  imageHint: "Wide works best: 2100 × 800 pixels. JPG, PNG or WebP, up to 5 MB.",
  imageRatioNote: "This picture isn't wide, so it will show with blurred space at the sides. For the best result use a wide image, about 2100 × 800.",
};

export const STATUS_LABELS: Record<BannerStatus, string> = { scheduled: "Scheduled", active: "Running", ended: "Ended", removed: "Taken down" };
export const STATUS_TONES: Record<BannerStatus, StatusTone> = { scheduled: "info", active: "success", ended: "neutral", removed: "danger" };

/** "7 days · 700 coins" */
export const DAY_OPTIONS = BANNER_DAYS.map((days) => ({
  value: days,
  label: `${days} days · ${(Number(days) * COIN_COSTS.bannerPerDay).toLocaleString("en")} coins`,
}));
