export const CTA_BANNER = {
  title: "Have something new to share? Put it on Nook.",
  description:
    "Publish your opening, offer or event with a few coins. Want more people to see it? Feature it on the home page or run a banner. You pay a simple price per day, never per click.",
  cta: "Get started",
  href: "/business",
  /** Add a photo here later, like "/cta-owner.jpg" from the public folder. Until then the banner is text only. */
  imageUrl: undefined as string | undefined,
  imageAlt: "A local shop owner at work",
};

/** How the banners at the top of the home page move. */
export const HERO_SWIPER = {
  /** How long a slide stays before the next one comes in on its own. */
  delayMs: 7000,
  /** How long one slide takes to glide to the next. */
  speedMs: 900,
  /** Space between slides, in pixels. */
  gap: 16,
  /** How many slides fit across: one on a phone, a little over one from a tablet up so the next one peeks in. */
  breakpoints: { 640: { slidesPerView: 1.09 }, 768: { slidesPerView: 1.14 } },
} as const;

/** The banner picture is almost the full width on a phone, and a bit less on a wide screen. */
export const HERO_IMAGE_SIZES = "(min-width: 768px) 88vw, 100vw";
