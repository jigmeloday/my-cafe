import type {
  AddressInput,
  ContactInput,
  PersonalInfoInput,
  PreferencesInput,
} from "@/lib/validations/profile.schema";
import { profileRepository } from "@/server/repositories/profile.repository";
import type { ProfileView } from "@/types/profile";

type Gender = PersonalInfoInput["gender"];
type PreferredContact = ContactInput["preferredContact"];
type Dzongkhag = AddressInput["dzongkhag"];

const toDateOnly = (date: Date | null) => (date ? date.toISOString().slice(0, 10) : "");
const fromDateOnly = (value: string) => (value ? new Date(`${value}T00:00:00Z`) : null);

export const profileService = {
  /** The profile for a user, with sensible defaults when they haven't saved anything yet. */
  async get(userId: string): Promise<ProfileView | null> {
    const user = await profileRepository.findByUserId(userId);
    if (!user) return null;
    const p = user.profile;

    return {
      email: user.email,
      role: user.role,
      joined: user.createdAt.toISOString().slice(0, 10),
      personal: { name: user.name, birthday: toDateOnly(p?.birthday ?? null), gender: (p?.gender ?? "") as Gender },
      contact: { phone: p?.phone ?? "", preferredContact: (p?.preferredContact ?? "email") as PreferredContact },
      address: {
        line1: p?.addressLine1 ?? "",
        line2: p?.addressLine2 ?? "",
        town: p?.town ?? "",
        dzongkhag: (p?.dzongkhag ?? "") as Dzongkhag,
        postalCode: p?.postalCode ?? "",
      },
      preferences: {
        channels: { email: p?.notifyEmail ?? true, sms: p?.notifySms ?? false, push: p?.notifyPush ?? true },
        topics: {
          followed: p?.topicFollowed ?? true,
          weekend: p?.topicWeekend ?? true,
          newPlaces: p?.topicNewPlaces ?? false,
          ending: p?.topicEnding ?? true,
          birthday: p?.topicBirthday ?? true,
        },
        allowPersonalisation: p?.allowPersonalisation ?? true,
        marketingConsent: p?.marketingConsent ?? false,
      },
      interests: p?.interests ?? [],
    };
  },

  async savePersonal(userId: string, { name, birthday, gender }: PersonalInfoInput) {
    await profileRepository.savePersonal(userId, name, { birthday: fromDateOnly(birthday), gender });
  },

  async saveContact(userId: string, { phone, preferredContact }: ContactInput) {
    await profileRepository.upsert(userId, { phone, preferredContact });
  },

  async saveAddress(userId: string, a: AddressInput) {
    await profileRepository.upsert(userId, {
      addressLine1: a.line1,
      addressLine2: a.line2,
      town: a.town,
      dzongkhag: a.dzongkhag,
      postalCode: a.postalCode,
    });
  },

  async saveInterests(userId: string, interests: string[]) {
    await profileRepository.upsert(userId, { interests: [...new Set(interests)] });
  },

  /** Records when promotional consent was given, and clears that date when it is withdrawn. */
  async savePreferences(userId: string, p: PreferencesInput) {
    const before = (await profileRepository.findByUserId(userId))?.profile;
    const turnedOn = p.marketingConsent && !before?.marketingConsent;

    await profileRepository.upsert(userId, {
      notifyEmail: p.channels.email,
      notifySms: p.channels.sms,
      notifyPush: p.channels.push,
      topicFollowed: p.topics.followed,
      topicWeekend: p.topics.weekend,
      topicNewPlaces: p.topics.newPlaces,
      topicEnding: p.topics.ending,
      topicBirthday: p.topics.birthday,
      allowPersonalisation: p.allowPersonalisation,
      marketingConsent: p.marketingConsent,
      marketingConsentAt: p.marketingConsent ? (turnedOn || !before?.marketingConsentAt ? new Date() : before.marketingConsentAt) : null,
    });
  },

  /** Deletes the account and everything linked to it. Business owners must remove their businesses first. */
  async deleteAccount(userId: string): Promise<{ ok: true } | { ok: false; error: string }> {
    if ((await profileRepository.countBusinesses(userId)) > 0) {
      return { ok: false, error: "You still own a business. Delete or transfer it before deleting your account." };
    }
    await profileRepository.deleteUser(userId);
    return { ok: true };
  },
};
