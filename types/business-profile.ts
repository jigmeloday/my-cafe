import type {
  BusinessContactInput,
  BusinessGeneralInput,
  BusinessHoursInput,
  BusinessLocationInput,
  BusinessOfferingsInput,
  BusinessSocialInput,
} from "@/lib/validations/business.schema";

export interface BusinessProfileData {
  general: BusinessGeneralInput;
  contact: BusinessContactInput;
  location: BusinessLocationInput;
  social: BusinessSocialInput;
  hours: BusinessHoursInput;
  offerings: BusinessOfferingsInput;
}
