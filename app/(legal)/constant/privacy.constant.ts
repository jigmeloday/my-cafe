import { LEGAL } from "@/lib/legal";

import type { LegalDocument } from "./legal.type";

const { company, contactEmail } = LEGAL;

export const PRIVACY: LegalDocument = {
  title: "Privacy Policy",
  intro:
    "This explains what information Nook keeps about you, why, who can see it, and the choices you have. We only collect what we need to run Nook, and we don't sell your personal information.",
  sections: [
    {
      id: "who",
      title: "Who we are",
      blocks: [
        { p: `Nook is run by ${company}, ${LEGAL.address}. We are responsible for the information described here. You can reach us at ${contactEmail}.` },
      ],
    },
    {
      id: "collect",
      title: "What we collect",
      blocks: [
        { p: "Information you give us:" },
        { ul: [
          "Your account: name, email address and a password. We keep only a scrambled (hashed) form of your password, never the password itself.",
          "Your profile, if you fill it in: birthday, gender, phone number, address, interests, and how you want to be contacted. All of this is optional.",
          "Things you do: promotions you save, places you follow, and reports you send.",
          "If you run a business: your business profile, opening hours, contact details, photos, promotions, banners, and your coin wallet and its history.",
          "If you write to us through the Contact page: your name, email address and message. We use them only to reply.",
          "If you apply for a job with us: what you send, such as your CV and contact details. We use it only to consider you for a role.",
          "If you choose to verify your business: your name as on your ID, your ID number, your trade licence number, and photos or PDFs of your ID, licence and shop.",
        ] },
        { p: "Information we collect as you use Nook:" },
        { ul: [
          "Views and clicks on promotions and banners. These are counted without your name or account, together with the page you came from (for example the home page).",
          "Technical details, such as your IP address and browser, which are kept with your sign-in session and used for security. Failed sign-in attempts are recorded briefly so we can stop people guessing passwords.",
          "A cookie that keeps you signed in (see Cookies below).",
        ] },
      ],
    },
    {
      id: "use",
      title: "How we use it",
      blocks: [
        { ul: [
          "To run Nook: create and protect your account, show promotions and places, and let businesses and customers use their dashboards.",
          "To send you account emails, such as confirming your email address and security messages.",
          "To send you updates about places you follow or promotions, only in the ways you chose in your notification settings. We only send promotional messages to people who agreed to them, and you can change your mind at any time.",
          "To make suggestions that suit your interests, if you allow personalisation in your settings.",
          "To keep Nook safe: stop fraud, spam and abuse, review reports, and check that businesses are real.",
          "To count how ads perform, so businesses can see how many people viewed and clicked.",
          "To follow the law and to answer lawful requests.",
        ] },
      ],
    },
    {
      id: "why",
      title: "Why we are allowed to use it",
      blocks: [
        { ul: [
          "Because you asked for it: to give you an account, a business page or a service you use.",
          "Because you agreed: for promotional messages and personalisation. You can withdraw your agreement at any time and it won't affect the past.",
          "Because it is needed to keep Nook safe, to count how ads perform, and to follow the law.",
        ] },
      ],
    },
    {
      id: "share",
      title: "Who can see your information",
      blocks: [
        { p: "Public: the information a business puts on its page and promotions is visible to everyone. Your own name and profile are not shown to other customers or businesses." },
        { p: "Businesses you follow see only totals and groups, such as how many followers they have, which areas they live in, which interests are common, and how many agreed to emails. They never see your name, email or phone." },
        { p: "Our team: a small number of Nook admins can see account details when they need to, for example to help you, review a report or stop abuse." },
        { p: "Service providers who help us run Nook, and who may only use your information for that purpose:" },
        { ul: [
          "our database and file storage provider (Neon);",
          "our email provider (Resend), which sends our emails;",
          "our hosting provider;",
          "a payment provider, once buying coins is switched on.",
        ] },
        { p: "We do not sell your personal information or give it to advertisers. If Nook is ever sold or merged with another business, your information may move with it, and we will tell you first. We may share information when the law requires it." },
      ],
    },
    {
      id: "verification",
      title: "Verification documents",
      blocks: [
        { p: "Your ID and licence are the most sensitive information we hold, so we handle them with extra care:" },
        { ul: [
          "They are kept in private storage that is not reachable from the public website.",
          "Only Nook admins who review verifications can open them. The business owner's own page and every other customer or business can't.",
          "Every time an admin opens a document, it is written to a log.",
          "We use them to check your business and for nothing else. They are never shown on your page.",
          "We keep them while your business account exists, and for a short time afterwards where needed for security or the law. You can ask us to delete them (see Your choices).",
        ] },
      ],
    },
    {
      id: "cookies",
      title: "Cookies",
      blocks: [
        { p: "We use one essential cookie to keep you signed in. It can't be read by scripts on the page and is sent only over a secure connection on the live site. We don't use advertising cookies or third-party trackers. If we add any in future, we will say so here and ask you first where the law requires it. You can block or delete cookies in your browser, but you won't be able to stay signed in." },
      ],
    },
    {
      id: "security",
      title: "How we protect it",
      blocks: [
        { ul: [
          "Passwords are stored in hashed form.",
          "The live site uses an encrypted (HTTPS) connection.",
          "Different people can see different things: customers, business owners and admins each have their own access, checked on the server every time.",
          "We limit sign-in attempts and sign-up requests to stop guessing and abuse.",
          "Important admin actions are logged.",
        ] },
        { p: "No website can promise perfect security. If something happens that puts your information at risk, we will tell the people affected and the authorities as the law requires." },
      ],
    },
    {
      id: "keep",
      title: "How long we keep it",
      blocks: [
        { ul: [
          "Your account and profile: until you delete your account. Your saved promotions, follows, notifications and reports are deleted with it.",
          "Business information: while the business account exists.",
          "Coin and wallet history: kept for our records and for accounting, tax and legal reasons, even after the business account is closed, as it shows what a business paid for.",
          "Contact messages: kept while we deal with your request, and for a short time after. Ask us to delete yours at any time.",
          "Job applications: kept only as long as needed to consider you. Ask us to delete yours at any time.",
          "Admin logs: kept for security and accountability.",
          "Failed sign-in records: about a day.",
          "View and click counts: kept as totals; they don't identify anyone.",
        ] },
      ],
    },
    {
      id: "choices",
      title: "Your choices and rights",
      blocks: [
        { ul: [
          "See and change your details and notification settings in your profile.",
          "Turn promotional messages and personalisation off at any time.",
          "Delete your customer account in your profile settings. A business owner should remove their business first, or contact us.",
          `Ask us for a copy of your information, to correct it, or to delete it, by writing to ${contactEmail}. We will answer within a reasonable time, and we may need to check it is really you.`,
        ] },
        { p: "If you are unhappy with how we handled your information, please tell us first so we can put it right." },
      ],
    },
    {
      id: "breach",
      title: "If something goes wrong",
      blocks: [
        { p: "If your information is lost or seen by someone who shouldn't see it, we will find out what happened, stop it, and tell the people affected and the authorities as the law requires, as soon as we reasonably can. We will say what happened, what information was involved, and what you can do." },
      ],
    },
    {
      id: "children",
      title: "Children",
      blocks: [
        { p: `Nook is not meant for children under ${LEGAL.minAge} without a parent or guardian's permission. If you believe a child has given us information without permission, contact us and we will delete it.` },
      ],
    },
    {
      id: "abroad",
      title: "Where your information is kept",
      blocks: [
        { p: "Our service providers may store or process information outside Bhutan. We only use providers who protect it and who may use it only to provide their service to us." },
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      blocks: [
        { p: "We may update this policy. The date at the top shows the latest version. If a change matters to you, we will tell you, for example by email or on the site." },
      ],
    },
    {
      id: "contact",
      title: "Contact us",
      blocks: [{ p: `Questions about privacy? Write to ${contactEmail}, or to ${company}, ${LEGAL.address}.` }],
    },
  ],
};
