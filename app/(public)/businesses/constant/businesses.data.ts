import { uniqueByHref } from "@/components/public/utils/detail.utils";

import { NEW_PLACES } from "../../discover/constant/discover.data";
import { OFFER_SECTIONS } from "../../home/constant/offers.constant";

const homePlaces = OFFER_SECTIONS.find((s) => s.id === "new")?.items ?? [];

export const BUSINESSES = uniqueByHref([...homePlaces, ...NEW_PLACES]);
