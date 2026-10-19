/** What a message to kuzu can be about. Shared by the Contact form and the admin inbox. */
export const CONTACT_TOPICS = [
  { id: "question", label: "A question about kuzu", text: "How something works, or an idea for making it better." },
  { id: "business", label: "My business account or coins", text: "Adding coins, a banner, a featured place, or an account problem." },
  { id: "verification", label: "Verification", text: "Your documents, a rejected request, or your Verified badge." },
  { id: "account", label: "My account", text: "Logging in, a suspended account, or a forgotten password." },
  { id: "privacy", label: "My information", text: "See, correct or delete what we keep about you." },
  { id: "other", label: "Something else", text: "Press, partnerships, or anything that doesn't fit above." },
] as const;

export type ContactTopicId = (typeof CONTACT_TOPICS)[number]["id"];

export const TOPIC_LABEL: Record<string, string> = Object.fromEntries(CONTACT_TOPICS.map((t) => [t.id, t.label]));
