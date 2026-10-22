import { COIN_COSTS, coinPriceMinor } from "@/lib/coins";
import { FEATURED_SLOTS_PER_DAY } from "@/lib/featured";
import { formatMoney } from "@/lib/formatters/currency";
import { LEGAL } from "@/lib/legal";

import type { LegalDocument } from "./legal.type";

const { company, contactEmail } = LEGAL;

export const TERMS: LegalDocument = {
  title: "Terms and Conditions",
  intro:
    "These are the rules for using Nook. We have tried to write them in plain words. By creating an account or using Nook you agree to them, so please read them.",
  sections: [
    {
      id: "about",
      title: "About Nook",
      blocks: [
        { p: `Nook is a website run by ${company} ("Nook", "we", "us"). It helps people in Bhutan find deals, events and new places, and it helps businesses tell people about them.` },
        { p: "Nook is for discovery only. You can't buy, sell or book anything on Nook. Any deal you take up is between you and the business." },
      ],
    },
    {
      id: "using",
      title: "Using Nook",
      blocks: [
        { p: `You must be at least ${LEGAL.minAge} years old to have an account, or have a parent or guardian's permission. Business accounts must be opened by someone who is allowed to act for the business.` },
        { p: "You may browse the public pages without an account. You need an account to save promotions, follow places, report ads or run a business page." },
        { p: "You agree to use Nook lawfully and to follow these terms and our Privacy Policy." },
      ],
    },
    {
      id: "accounts",
      title: "Your account",
      blocks: [
        { ul: [
          "Give us true and current details, and confirm your email address.",
          "Keep your password to yourself. You are responsible for what happens under your account, so tell us at once if someone else may be using it.",
          "One person, one account. Don't create accounts to get around a suspension or a limit.",
          "A customer account and a business account are different. A business owner uses the business dashboard instead of the customer pages.",
        ] },
        { p: "You can delete your customer account from your profile settings. A business owner needs to remove their business first, or contact us." },
      ],
    },
    {
      id: "customers",
      title: "For customers",
      blocks: [
        { p: "Promotions, events and business details are written by the businesses. We don't check every one, and we don't promise they are accurate, current or available. Check the details with the business before you rely on them." },
        { p: "If an ad looks wrong, misleading or unsafe, please use the Report button on it." },
      ],
    },
    {
      id: "businesses",
      title: "For businesses",
      blocks: [
        { p: "If you post on Nook you promise that:" },
        { ul: [
          "what you post is true, not misleading, and clear about price, dates and conditions;",
          "you will honour the offers you publish while they are live, and end them when they are over;",
          "you own, or are allowed to use, the photos, names and text you upload;",
          "you follow the laws of Bhutan, including those on advertising, consumer protection and the goods or services you offer.",
        ] },
        { p: "You can choose to verify your business by sending your ID and trade licence. Being verified shows a Verified badge. It means we checked the documents you sent. It is not a promise about the quality of your business, and it does not mean Nook recommends you." },
      ],
    },
    {
      id: "coins",
      title: "Coins, publishing, banners and featuring",
      blocks: [
        { p: "Businesses pay for some things with coins, which are prepaid credits in your business wallet." },
        { ul: [
          `A promotion costs ${COIN_COSTS.publishPerDay} coins for each day it runs, from its start date to its end date, paid when it goes live. Saving a draft is free, and so is editing a live promotion, except that moving its end date later costs coins for the extra days.`,
          `A homepage banner costs ${COIN_COSTS.bannerPerDay} coins for each day it runs. Featuring a promotion in the Featured row costs ${COIN_COSTS.featuredPerDay} coins a day, on top of the daily price. Prices can change; the price you see when you confirm is the price you pay.`,
          `Featured places are limited to ${FEATURED_SLOTS_PER_DAY} promotions a day. When a day is full it is sold out.`,
          `Coins are bought with Bhutanese ngultrum (Nu.). A small purchase costs ${formatMoney(coinPriceMinor(100))} for 100 coins, and bigger amounts cost less for each coin. You always see the exact price in Nu. before you pay.`,
          "Coins are not money. They have no cash value, can't be exchanged for cash and can't be transferred to someone else.",
        ] },
        { p: "Banners and featured promotions are shown in a rotating, random order. We don't promise a position, a number of views or clicks, or any result from an ad. Views and clicks are counted to show you how it went." },
        { p: "Coins you have spent are not refunded. This includes when:" },
        { ul: [
          "you end a promotion or banner before its end date, or delete it, and the days you paid for are not used;",
          "we take a promotion, banner or featured place down, after a report or because it breaks these terms or the law;",
          "we suspend or close your business or account.",
        ] },
        { p: "The days you paid for are used up whether or not the ad is shown, so nothing is returned for the unused days. If we make a mistake, such as charging you twice, we will put the coins back." },
        { p: "Prices are shown in Bhutanese ngultrum (Nu.). Unless a price says otherwise, taxes that apply by law are added or included as shown when you confirm. If you buy coins through a payment provider, your payment is also covered by that provider's terms." },
        { p: "Your wallet belongs to your business account. Coins can't be moved to another business or person. If your business account is closed, any coins left in it are lost, except where the law says otherwise or where we closed it by mistake." },
        { p: "Buying coins will be done through a payment provider. When it is switched on, we will explain any extra terms at the time you pay." },
      ],
    },
    {
      id: "ad-rules",
      title: "Advertising rules",
      blocks: [
        { p: "Every promotion, event and banner must follow these rules. We can review any of them at any time, before or after it goes live." },
        { ul: [
          "Show the real price, the real offer and its real dates and conditions. Don't use bait offers, fake discounts, or \"was\" prices that were never charged.",
          "Don't advertise goods or services that are illegal in Bhutan, or that need a licence you don't have.",
          "Don't use another business's name, logo or photos to suggest you are connected to it.",
          "Don't promise results you can't deliver, and don't make false health or safety claims.",
          "Photos and text must be yours or used with permission, and must not show people who haven't agreed to appear.",
        ] },
        { p: "If an ad breaks these rules, we can ask you to change it, take it down, limit your account, or suspend your business. Coins already paid are not returned (see Coins above)." },
      ],
    },
    {
      id: "ours",
      title: "Nook's content and your content",
      blocks: [
        { p: "The Nook name, logo, design, software and the way the site is put together belong to us or to those who license them to us. You may use Nook to browse and to run your business page, but you may not copy, sell or reuse them without our written permission." },
        { p: "Businesses promise that they have the right to post what they upload, and they accept responsibility if someone else says it breaks their rights. If a claim is made against Nook because of what a business posted, the business agrees to help us deal with it and to cover reasonable costs that come from its own breach of these terms." },
        { p: "If you think something on Nook copies your work or breaks your rights, contact us with the link and what is wrong, and we will look at it quickly and may remove it while we do." },
      ],
    },
    {
      id: "content",
      title: "What you post",
      blocks: [
        { p: "You keep ownership of what you post. You give us permission to store it, show it on Nook and in search, and make copies as needed to run the service. This permission ends when you delete the content, except for copies that we must keep for a short time for security or the law." },
        { p: "You must not post anything that:" },
        { ul: [
          "is false, misleading, or a scam;",
          "is offensive, hateful, threatening or sexual;",
          "breaks someone's rights, such as copyright, trademarks or privacy;",
          "is illegal in Bhutan, or promotes something illegal;",
          "is spam, or repeats the same offer many times.",
        ] },
      ],
    },
    {
      id: "reports",
      title: "Reports and removals",
      blocks: [
        { p: "Anyone with an account can report a promotion, event or banner. An admin reviews reports and can dismiss them, warn the business, or take the ad down. The person who reported is not named to the business." },
        { p: "A removed promotion or banner can't be republished, and the coins you spent on it are not refunded, even for days that were still left. If you think we got it wrong, contact us and we will look again." },
      ],
    },
    {
      id: "rules",
      title: "Things you must not do",
      blocks: [
        { ul: [
          "Try to break into Nook, test its security without our written permission, or get around its limits and protections.",
          "Use bots, scrapers or other tools to copy large parts of Nook.",
          "Upload viruses or anything meant to harm the service or other people.",
          "Pretend to be someone else, or fake a business or an identity document.",
          "Use Nook to send unwanted messages.",
        ] },
      ],
    },
    {
      id: "suspension",
      title: "Suspension and ending",
      blocks: [
        { p: "We may suspend or close an account, or remove content, if you break these terms, if the law requires it, or to protect other people. Where we can, we will tell you why. Coins you have spent, and coins left in your wallet when we close an account because you broke these terms, are not refunded. You can stop using Nook at any time." },
      ],
    },
    {
      id: "links",
      title: "Other websites",
      blocks: [{ p: "Nook may link to websites run by businesses or others. We don't control them and are not responsible for them." }],
    },
    {
      id: "liability",
      title: "Our responsibility",
      blocks: [
        { p: "We work to keep Nook running and accurate, but we provide it \"as it is\". It may sometimes be unavailable or contain mistakes." },
        { p: "To the extent the law allows, Nook is not responsible for what businesses post, for deals you take up with them, or for losses that come from using the service. Nothing in these terms removes any right you have under the law that can't be removed." },
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      blocks: [{ p: "We may update these terms. The date at the top shows when they last changed. If a change is important we will tell you, for example by email or on the site. If you keep using Nook after a change, you accept the new terms." }],
    },
    {
      id: "general",
      title: "General",
      blocks: [
        { ul: [
          "These terms, with the Privacy Policy, are the whole agreement between you and Nook about the service.",
          "If part of these terms can't be enforced, the rest still applies.",
          "If we don't enforce a rule straight away, we haven't given it up.",
          "We are not responsible for failures caused by things outside our control, such as power or internet outages, natural events, or problems with our hosting, email or payment providers.",
          "You may not pass your rights under these terms to someone else without our agreement. We may pass ours on if Nook is run by a different company in future, and we will tell you.",
        ] },
      ],
    },
    {
      id: "law",
      title: "Law and disputes",
      blocks: [{ p: "These terms follow the laws of Bhutan. If we can't settle a disagreement by talking, it will be handled by the courts of Bhutan." }],
    },
    {
      id: "contact",
      title: "Contact us",
      blocks: [{ p: `Questions about these terms? Write to ${contactEmail}, or to ${company}, ${LEGAL.address}.` }],
    },
  ],
};
