export type ShareKind = "promotion" | "business";

/** Where the downloadable 1080×1920 story picture for a page comes from. */
export const storyImageHref = (kind: ShareKind, slug: string) => `/api/share/story?type=${kind}&slug=${encodeURIComponent(slug)}`;

/** Buttons that open a site's own share screen with the link filled in. (Instagram and TikTok have none, so they use the story picture.) */
export function shareLinks(url: string, text: string) {
  const link = encodeURIComponent(url);
  const message = encodeURIComponent(`${text} ${url}`);
  return [
    { id: "facebook", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${link}` },
    { id: "whatsapp", label: "WhatsApp", href: `https://wa.me/?text=${message}` },
    { id: "telegram", label: "Telegram", href: `https://t.me/share/url?url=${link}&text=${encodeURIComponent(text)}` },
    { id: "x", label: "X", href: `https://twitter.com/intent/tweet?url=${link}&text=${encodeURIComponent(text)}` },
  ];
}
