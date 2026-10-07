import type {
  BusinessContactInput,
  BusinessGeneralInput,
  BusinessHoursInput,
  BusinessOfferingsInput,
  BusinessSocialInput,
} from "@/lib/validations/business.schema";
import type { AddressInput } from "@/lib/validations/profile.schema";

export interface BusinessProfileData {
  general: BusinessGeneralInput;
  contact: BusinessContactInput;
  location: AddressInput;
  social: BusinessSocialInput;
  hours: BusinessHoursInput;
  offerings: BusinessOfferingsInput;
}

export interface ProfileTab {
  id: string;
  label: string;
}
