import { COIN_COSTS } from "@/lib/coins";
import { FEATURED_SLOTS_PER_DAY } from "@/lib/featured";

export interface Faq {
  q: string;
  a: string;
}

export interface FaqTopic {
  id: string;
  title: string;
  faqs: Faq[];
}

export const HELP_COPY = {
  title: "Help centre",
  lead: "Quick answers about using kuzu. Can't find yours? Get in touch and we'll help.",
  searchLabel: "Search the help centre",
  searchPlaceholder: "Search, for example “coins” or “password”",
  nothingTitle: "No answers match that",
  nothingText: "Try a different word, or write to us.",
};

/** The numbers in the answers come from the app's own settings, so they can't go out of date. */
export const FAQ_TOPICS: FaqTopic[] = [
  {
    id: "start",
    title: "Getting started",
    faqs: [
      { q: "What is kuzu?", a: "kuzu helps you find deals, events and new places in Bhutan, and helps local businesses tell people about them. It is for discovery: you can't buy or book on kuzu." },
      { q: "Do I need an account?", a: "No, you can browse and search without one. You need a free account to save promotions, follow places and report ads." },
      { q: "How do I save a promotion or follow a place?", a: "Press the heart on a promotion to save it, and the Follow button on a business page. Everything you saved and follow is in your profile." },
      { q: "How do I search?", a: "Use the search bar at the top. Type what you want, add a place such as Paro, and choose when: today, this weekend or this week." },
    ],
  },
  {
    id: "account",
    title: "Your account",
    faqs: [
      { q: "Why do I have to confirm my email?", a: "It proves the address is yours and keeps your account safe. We send a link when you sign up, and you can't log in until you open it." },
      { q: "I didn't get the confirmation email", a: "Look in your spam folder first. On the “Check your email” page you can send a new link, one a minute. Make sure you typed your address correctly when you signed up." },
      { q: "I forgot my password", a: "Resetting a password by email isn't available yet. Write to us from the address on your account and we'll help you get back in." },
      { q: "How do I change my details or delete my account?", a: "Open your profile. You can change your details and notification choices there, and delete a customer account. If you run a business, remove the business first, or contact us." },
      { q: "My account was suspended", a: "Accounts are suspended when the rules are broken or to keep people safe. Write to us and we will explain what happened and what can be done." },
    ],
  },
  {
    id: "deals",
    title: "Deals and events",
    faqs: [
      { q: "Can I buy or book on kuzu?", a: "No. kuzu shows what's on. You visit the business or contact them directly, so check the details with them first." },
      { q: "What does “Popular”, “Featured” or “Sponsored” mean?", a: "Popular means a lot of people clicked it recently. Featured and Sponsored are paid places that businesses buy. They are shown in a random order so everyone gets a fair turn." },
      { q: "An offer looks wrong or misleading", a: "Please report it. Open the promotion, press Report, and tell us what's wrong. We review every report." },
    ],
  },
  {
    id: "business",
    title: "For businesses",
    faqs: [
      { q: "How do I list my business?", a: "Create an account and choose “I own a business”. Fill in your business profile, then publish a promotion or event from your dashboard." },
      { q: "What does it cost to publish?", a: `Publishing a promotion costs ${COIN_COSTS.publish} coins, once. Saving a draft and editing a live promotion are free.` },
      { q: "How do I get coins?", a: "Buying coins online isn't available yet. For now we add coins to your wallet for you: write to us and tell us the name of your business." },
      { q: "How do banners work?", a: `A banner shows your image at the top of the home page. It costs ${COIN_COSTS.bannerPerDay} coins a day, for 3, 7 or 14 days, paid when you create it. Banners rotate in a random order, so no business keeps the first spot.` },
      { q: "How do I feature a promotion?", a: `When you publish, or later on a live promotion, choose how many days to feature it. It costs ${COIN_COSTS.featuredPerDay} coins a day on top of publishing. Only ${FEATURED_SLOTS_PER_DAY} promotions can be featured on any one day, so busy days can sell out.` },
      { q: "How do I get the Verified badge?", a: "Open Verification in your dashboard and send your ID and trade licence. We review them, usually within a few days, and tell you the result. If something needs fixing we say what, and you can send them again." },
      { q: "Are my documents safe?", a: "Yes. They are kept in private storage, only our review team can open them, every opening is logged, and they are never shown on your page." },
      { q: "Why can't I see the public site as a business owner?", a: "Business accounts stay in the dashboard. To see how your page looks to customers, use Preview public page." },
      { q: "How do I see how my promotions are doing?", a: "Overview and Analytics in your dashboard show views, clicks, saves and your followers, as totals. Days follow Bhutan time." },
      { q: "My promotion or banner was removed", a: "Ads can be removed after reports if they break the rules. You'll see a message on your Overview. Coins already spent aren't refunded. If you think it was a mistake, write to us." },
    ],
  },
  {
    id: "safety",
    title: "Safety and privacy",
    faqs: [
      { q: "How do I report an ad?", a: "Open the promotion or event and press Report, or press “Report ad” on a sponsored banner. You need to be logged in. The business isn't told who reported." },
      { q: "Who can see my information?", a: "Your profile isn't shown to other people. Businesses you follow only see totals, never your name or email. Our privacy policy explains the details." },
      { q: "How do I ask for my information to be corrected or deleted?", a: "Change it in your profile, or write to us and we'll help. See the privacy policy for what we keep and for how long." },
    ],
  },
];
