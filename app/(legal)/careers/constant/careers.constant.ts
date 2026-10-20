import { Compass, HeartHandshake, Scale, type LucideIcon } from "lucide-react";

/** An open role. Add one to `OPEN_ROLES` and it appears on the Careers page. */
export interface Role {
  /** Used for the link to this role, e.g. /careers#community-manager */
  id: string;
  title: string;
  team: string;
  location: string;
  /** For example "Full-time", "Part-time" or "Internship". */
  type: string;
  summary: string;
  /** What the person will do. */
  doing: string[];
  /** What we're looking for. */
  looking: string[];
}

/**
 * Roles we are hiring for right now. Leave this empty when there are none: the page then invites people to send
 * their details anyway, instead of showing jobs that aren't real. To add a role, copy this example:
 *
 * {
 *   id: "community-manager",
 *   title: "Community manager",
 *   team: "Operations",
 *   location: "Thimphu",
 *   type: "Full-time",
 *   summary: "Help businesses get the most out of Nook.",
 *   doing: ["Welcome new businesses and help them set up", "Review reports and verification requests"],
 *   looking: ["Clear, friendly writing in English and Dzongkha", "Calm judgement when things are unclear"],
 * }
 */
export const OPEN_ROLES: Role[] = [];

export interface Value {
  icon: LucideIcon;
  title: string;
  text: string;
}

export const CAREERS_COPY = {
  title: "Work with us",
  lead: "We're building the easiest way to find what's on in Bhutan, and to help local businesses be found. Come and help us do it well.",
  whyTitle: "How we work",
  values: [
    { icon: HeartHandshake, title: "Local first", text: "We build for people and businesses here, and we talk to them often. The best ideas come from the shops and the streets." },
    { icon: Scale, title: "Fair and honest", text: "Small businesses get the same chance as big ones. We say what things cost and we respect people's information." },
    { icon: Compass, title: "Small steps, done properly", text: "We ship things that work and test them for real before we move on. We'd rather do fewer things well." },
  ] satisfies Value[],
  rolesTitle: "Open roles",
  noRolesTitle: "No open roles right now",
  noRolesText: "We're not hiring for a specific job at the moment, but we're always glad to hear from people who care about this. Tell us what you do and what you'd like to work on.",
  howTitle: "How hiring works",
  how: [
    "You send us a short note about yourself and anything you'd like us to see: a CV, a portfolio, a link.",
    "We read every application and reply, even when the answer is no.",
    "If it looks like a fit, we talk, and then we give you a small, real task related to the work.",
    "We decide together, and we tell you our decision.",
  ],
  privacy: "We use what you send only to consider you for a role. You can ask us to delete it at any time.",
};
