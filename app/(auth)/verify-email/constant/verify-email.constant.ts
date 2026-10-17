import { RESEND_COOLDOWN_SECONDS } from "@/lib/cooldown";

export const VERIFY_COPY = {
  title: "Check your email",
  sentTo: "We sent a verification link to",
  steps: [
    "Open the email from kuzu.",
    "Press “Verify my email”.",
    "You'll be signed in and taken to your account.",
  ],
  tips: "Nothing there after a minute? Check your spam folder. The link works for 60 minutes.",
  resend: "Resend email",
  resendIn: (seconds: number) => `Resend email in ${seconds}s`,
  wrongAddress: "Wrong address?",
  startAgain: "Create account again",
};

/** Matches the server: a new email can't go out sooner than this. */
export const COOLDOWN = RESEND_COOLDOWN_SECONDS;
