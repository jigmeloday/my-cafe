import { APP_NAME, BRAND, button, escapeHtml, greeting, layout, note, type EmailContent } from "./templates";

/** "22 Oct 2026", in Bhutan time. */
const dateLabel = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Thimphu" }).format(date);

const coins = (value: number) => value.toLocaleString("en");
const site = () => process.env.BETTER_AUTH_URL ?? "";

/** A big round icon at the top of the card. Drawn with a character and colours, as email apps block most images. */
const badge = (glyph: string, background: string, color: string) =>
  `<table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:0 auto 20px"><tr><td width="76" height="76" align="center" valign="middle" style="width:76px;height:76px;border-radius:38px;background:${background};color:${color};font-size:38px;font-weight:700;line-height:76px">${glyph}</td></tr></table>`;

/** One "label ... value" line inside a summary card. */
const row = (label: string, value: string, last = false) =>
  `<tr><td style="padding:10px 0;${last ? "" : `border-bottom:1px solid ${BRAND.page};`}font-size:14px;color:${BRAND.muted}">${escapeHtml(label)}</td><td align="right" style="padding:10px 0;${last ? "" : `border-bottom:1px solid ${BRAND.page};`}font-size:14px;font-weight:600;color:${BRAND.ink}">${escapeHtml(value)}</td></tr>`;

const card = (rows: string) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;background:#fbf8f8;border:1px solid ${BRAND.page};border-radius:14px"><tr><td style="padding:6px 18px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr></table>`;

const centered = (html: string) => `<div style="text-align:center">${html}</div>`;

/** Sent when a business is verified, either by reviewing its documents or by an admin directly. */
export function businessVerifiedEmail(input: { name: string; businessName: string; date?: Date }): EmailContent {
  const { name, businessName, date = new Date() } = input;
  const url = `${site()}/business/promotions/new`;
  const steps = ["A Verified badge now shows on your business page.", "People trust verified businesses more, so your promotions stand out.", "You can publish your first promotion whenever you are ready."];
  return {
    subject: `${businessName} is verified on ${APP_NAME}`,
    text: `Hi ${name},\n\nGreat news: ${businessName} is now a verified business on ${APP_NAME}.\n\n${steps.map((s) => `- ${s}`).join("\n")}\n\nCreate a promotion: ${url}\n\nThank you for sending your documents.`,
    html: layout(
      "You're verified",
      `${centered(greeting(name))}
       <p style="margin:0 0 16px;text-align:center">Great news: <strong>${escapeHtml(businessName)}</strong> is now a verified business on ${APP_NAME}.</p>
       ${card(row("Business", businessName) + row("Status", "Verified ✓") + row("Verified on", dateLabel(date), true))}
       <p style="margin:24px 0 8px;font-weight:700">What this means</p>
       <ul style="margin:0;padding-left:20px;color:${BRAND.ink}">${steps.map((s) => `<li style="margin:0 0 6px">${escapeHtml(s)}</li>`).join("")}</ul>
       ${button(url, "Create a promotion", true)}
       ${centered(note("Thank you for sending your documents."))}`,
      `${businessName} now shows the Verified badge.`,
      undefined,
      badge("✓", "#e6f4ea", "#1e7a3c"),
    ),
  };
}

/** Sent when an admin adds coins to a business's wallet. */
export function coinsAddedEmail(input: { name: string; businessName: string; coins: number; balance: number; note?: string; date?: Date }): EmailContent {
  const { name, businessName, balance, note: reason, date = new Date() } = input;
  const url = `${site()}/business/wallet`;
  return {
    subject: `${coins(input.coins)} coins added to your ${APP_NAME} wallet`,
    text: `Hi ${name},\n\n${coins(input.coins)} coins were added to the ${APP_NAME} wallet of ${businessName}.\n\nCoins added: ${coins(input.coins)}\nNew balance: ${coins(balance)}\nDate: ${dateLabel(date)}${reason ? `\nNote: ${reason}` : ""}\n\nOpen your wallet: ${url}\n\nUse coins to publish promotions, feature them on the home page, or run a banner.`,
    html: layout(
      "Coins added",
      `${centered(greeting(name))}
       <p style="margin:0;text-align:center;font-size:44px;line-height:1.1;font-weight:800;letter-spacing:-1px;color:${BRAND.maroon}">+${coins(input.coins)}</p>
       <p style="margin:4px 0 20px;text-align:center;color:${BRAND.muted}">coins added to the wallet of <strong style="color:${BRAND.ink}">${escapeHtml(businessName)}</strong></p>
       ${card(row("Coins added", `+${coins(input.coins)}`) + row("New balance", `${coins(balance)} coins`) + row("Date", dateLabel(date), !reason) + (reason ? row("Note", reason, true) : ""))}
       <p style="margin:20px 0 0;text-align:center;color:${BRAND.muted};font-size:14px">Use coins to publish promotions, feature them on the home page, or run a banner.</p>
       ${button(url, "Open your wallet", true)}`,
      `${coins(input.coins)} coins were added. Your balance is ${coins(balance)}.`,
      undefined,
      badge("+", "#fbf1dc", "#a8741a"),
    ),
  };
}
