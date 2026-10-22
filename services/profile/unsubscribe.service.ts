import { userIdFromToken } from "@/lib/unsubscribe";
import { profileRepository } from "@/server/repositories/profile.repository";

export const unsubscribeService = {
  /** Switches off promotional email for the person the token belongs to. False when the token isn't valid. */
  async run(token: string): Promise<boolean> {
    const userId = userIdFromToken(token);
    if (!userId) return false;
    await profileRepository.withdrawMarketing(userId);
    return true;
  },
};
