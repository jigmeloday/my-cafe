/** Where people go to be told "check your email", with their address so the page can show it and offer Resend. */
export const verifyEmailHref = (email: string) => `/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`;
