import { uniqueByHref } from "@/components/public/utils/detail.utils";

import { DEALS } from "../../deals/constant/deals.data";
import { OFFER_SECTIONS } from "../../home/constant/offers.constant";

const homeOffers = OFFER_SECTIONS.find((s) => s.id === "popular")?.items ?? [];

export const PROMOTIONS = uniqueByHref([...DEALS, ...homeOffers]);
