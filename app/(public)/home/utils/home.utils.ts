import { AREAS } from "../constant/areas.constant";
import type { AreaItem, AreaTab } from "../model/home.type";

export const getAreas = (tab: AreaTab): AreaItem[] => AREAS[tab];
