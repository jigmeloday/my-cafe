/** How long someone must wait before another verification email can be sent to the same account. */
export const RESEND_COOLDOWN_SECONDS = 60;

/** True when something was sent less than `seconds` ago. Nothing sent yet (null) is never cooling down. */
export function isCoolingDown(sentAt: Date | null | undefined, now = new Date(), seconds = RESEND_COOLDOWN_SECONDS): boolean {
  return Boolean(sentAt) && now.getTime() - (sentAt as Date).getTime() < seconds * 1000;
}
