import { cache } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { profileService } from "@/services/profile/profile.service";

/** The signed-in person's profile. Loaded once per request, however many components ask. */
export const getCurrentProfile = cache(async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await profileService.get(user.id);
  if (!profile) redirect("/login");
  return profile;
});
