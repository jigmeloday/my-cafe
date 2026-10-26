import { APP_NAME, BRAND, button, escapeHtml, greeting, layout, note, type EmailContent } from "./templates";

const site = () => process.env.BETTER_AUTH_URL ?? "";

/** "22 Oct 2026", in Bhutan time. */
const dateLabel = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Thimphu" }).format(date);

/** One "label: value" line, left out when there is no value. */
const line = (label: string, value?: string | null) =>
  value ? `<p style="margin:0 0 6px;font-size:15px"><span style="color:${BRAND.muted}">${escapeHtml(label)}:</span> <strong>${escapeHtml(value)}</strong></p>` : "";

export interface RegistrationEmailInput {
  name: string;
  eventTitle: string;
  businessName: string;
  slug: string;
  startsAt: Date | null;
  endsAt: Date | null;
  /** "10:00 am – 4:00 pm", or empty. */
  time: string;
  location: string;
}

/** The "you're in" email sent when someone reserves a seat. It names the organiser and the event so they can find it again. */
export function registrationConfirmedEmail(input: RegistrationEmailInput): EmailContent {
  const { name, eventTitle, businessName, slug, startsAt, endsAt, time, location } = input;
  const url = `${site()}/events/${slug}`;
  const when = startsAt && endsAt && startsAt.getTime() !== endsAt.getTime() ? `${dateLabel(startsAt)} to ${dateLabel(endsAt)}` : startsAt ? dateLabel(startsAt) : endsAt ? `Until ${dateLabel(endsAt)}` : "";
  const facts = [["Event", eventTitle], ["Organiser", businessName], ["When", when], ["Time", time], ["Where", location]] as const;

  return {
    subject: `You're registered: ${eventTitle}`,
    text: `Hi ${name},\n\nYou have a seat at ${eventTitle}, organised by ${businessName}.\n\n${facts.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nYour name and phone were shared with the organiser. See the event: ${url}\n\nCan't make it? Open the event and cancel your registration so someone else can have your seat.`,
    html: layout(
      "You're registered",
      `${greeting(name)}
       <p style="margin:0 0 16px">You have a seat at <strong>${escapeHtml(eventTitle)}</strong>, organised by ${escapeHtml(businessName)}.</p>
       <div style="padding:14px 16px;background:${BRAND.maroonSoft};border-radius:12px">${facts.map(([k, v]) => line(k, v)).join("")}</div>
       ${button(url, "See the event")}
       ${note(`Your name and phone were shared with the organiser. Can't make it? Open the event and cancel your registration so someone else can have your seat.`)}`,
      `You have a seat at ${eventTitle}.`,
    ),
  };
}

