import type { Role } from "@/generated/prisma/enums";
import type {
  AddressInput,
  ContactInput,
  PersonalInfoInput,
  PreferencesInput,
} from "@/lib/validations/profile.schema";

/** Everything the profile pages show for one signed-in person. */
export interface ProfileView {
  email: string;
  role: Role;
  /** "YYYY-MM-DD" */
  joined: string;
  personal: PersonalInfoInput;
  contact: ContactInput;
  address: AddressInput;
  preferences: PreferencesInput;
  interests: string[];
}
