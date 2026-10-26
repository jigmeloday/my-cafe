import { getCurrentUser } from "@/lib/session";
import { profileService } from "@/services/profile/profile.service";
import { registrationService } from "@/services/registration/registration.service";

import { ReserveSeat } from "./reserve-seat";

/** The reserve button for an event, or nothing when the event doesn't take reservations. Knows who is looking. */
export async function EventSeat({ promotionId, path }: { promotionId: string; path: string }) {
  const user = await getCurrentUser();
  const status = await registrationService.seatStatus(promotionId, user?.id ?? null);
  if (!status) return null;

  const canRegister = user?.role === "USER";
  const profile = canRegister && user ? await profileService.get(user.id) : null;

  return (
    <ReserveSeat
      promotionId={promotionId}
      status={status}
      signedIn={user !== null}
      canRegister={canRegister}
      loginHref={`/login?next=${encodeURIComponent(path)}`}
      defaultName={user?.name ?? ""}
      defaultPhone={profile?.contact.phone ?? ""}
    />
  );
}
