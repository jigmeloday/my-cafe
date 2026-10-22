import type { StatusTone } from "@/components/shared/status-badge";
import { COIN_COSTS } from "@/lib/coins";
import { BANNER_DAYS } from "@/lib/validations/banner.schema";

import type { BannerStatus } from "@/services/banner/banner.service";

export const BANNERS_COPY = {
  title: "Banners",
  subtitle: "A banner puts your image at the top of the home page for a few days. You pay in coins when you create it, and our team checks it before it goes live.",
  create: "Create banner",
  newTitle: "Create a banner",
  newSubtitle: "Add an image and a headline and choose how long it runs. It opens your business page. Our team checks every banner before it shows; if it isn't approved, your coins are refunded.",
  editTitle: "Edit banner",
  editSubtitle: "Change the picture, headline or text for free. You can add days at the end; the days you already paid for stay as they are.",
  edit: "Edit",
  delete: "Delete",
  deleteTitle: "Delete this banner?",
  deleteConfirm: "Delete banner",
  deleteBody: (title: string, running: boolean, refundable = 0, resubmitted = false) =>
    resubmitted
      ? `“${title}” was approved and has already been shown, and it is waiting for a second check because you changed it. It will be deleted, and the days you paid for are not refunded.`
      : refundable > 0
      ? `“${title}” hasn't been approved yet, so it was never shown. It will be deleted and your ${refundable.toLocaleString("en")} coins will be refunded to your wallet.`
      : `“${title}” will be deleted${running ? " and stop showing on the home page right away" : ""}, along with its views and clicks. The days you paid for are not refunded.`,
  removedByNook: "Removed by Nook",
  save: "Save changes",
  savePaid: "Pay & save changes",
  noExtra: "Don't add days",
  back: "Banners",
  emptyTitle: "No banners yet",
  emptyDescription: "Create your first banner to be seen by everyone who opens Nook.",
  submit: "Pay & send for review",
  reviewWaiting: "Our team is checking it. It goes live on its first day once approved.",
  imageHint: "Wide works best: 2100 × 800 pixels. JPG, PNG or WebP, up to 5 MB.",
  imageRatioNote: "This picture isn't wide, so it will show with blurred space at the sides. For the best result use a wide image, about 2100 × 800.",
};

export const STATUS_LABELS: Record<BannerStatus, string> = { scheduled: "Scheduled", active: "Running", ended: "Ended", removed: "Taken down", pending: "In review", rejected: "Not approved" };
export const STATUS_TONES: Record<BannerStatus, StatusTone> = { scheduled: "info", active: "success", ended: "neutral", removed: "danger", pending: "warning", rejected: "danger" };

/** "7 days · 700 coins" */
export const DAY_OPTIONS = BANNER_DAYS.map((days) => ({
  value: days,
  label: `${days} days · ${(Number(days) * COIN_COSTS.bannerPerDay).toLocaleString("en")} coins`,
}));
